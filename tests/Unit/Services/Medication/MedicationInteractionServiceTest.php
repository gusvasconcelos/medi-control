<?php

namespace Tests\Unit\Services\Medication;

use Tests\TestCase;
use App\Models\Medication;
use App\Models\MedicationInteraction;
use App\Services\Medication\MedicationInteractionService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Config;
use Mockery;
use OpenAI\Responses\Chat\CreateResponse;

class MedicationInteractionServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('openai.api_key', 'test-key');
        Config::set('openai.check_interactions.model', 'gpt-5-nano');
    }

    public function test_check_returns_empty_collection_when_no_medications_provided(): void
    {
        $medication = Medication::factory()->create();

        $result = MedicationInteractionService::check($medication, collect([]));

        $this->assertCount(0, $result);
    }

    public function test_check_saves_interactions_to_database_when_found(): void
    {
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $mockClient = Mockery::mock('overload:OpenAI');
        $mockChatClient = Mockery::mock();
        $mockResponse = Mockery::mock(CreateResponse::class);

        $openAIResponse = json_encode([
            'interactions' => [
                [
                    'medication_id' => $medication2->id,
                    'has_interaction' => true,
                    'severity' => 'moderate',
                    'description' => 'Pode elevar níveis séricos em 40%.',
                    'recommendation' => 'Monitoramento clínico recomendado.',
                ],
            ],
        ]);

        $mockChoice = (object) [
            'message' => (object) [
                'content' => $openAIResponse,
            ],
        ];

        $mockResponse->choices = [$mockChoice];

        $mockChatClient->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($args) {
                return isset($args['model'])
                    && isset($args['messages'])
                    && $args['response_format']['type'] === 'json_object';
            }))
            ->andReturn($mockResponse);

        $mockClient->shouldReceive('client')
            ->with('test-key')
            ->andReturn((object) ['chat' => fn () => $mockChatClient]);

        $result = MedicationInteractionService::check($medication1, collect([$medication2->id]));

        $this->assertCount(1, $result);
        $this->assertEquals('moderate', $result->first()->severity);

        $this->assertDatabaseHas('medication_interactions', [
            'owner_id' => $medication1->id,
            'related_id' => $medication2->id,
            'severity' => 'moderate',
        ]);
    }

    public function test_check_does_not_save_interactions_when_has_interaction_is_false(): void
    {
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        // Mock OpenAI client
        $mockClient = Mockery::mock('overload:OpenAI');
        $mockChatClient = Mockery::mock();
        $mockResponse = Mockery::mock(CreateResponse::class);

        $openAIResponse = json_encode([
            'interactions' => [
                [
                    'medication_id' => $medication2->id,
                    'has_interaction' => false,
                    'severity' => 'none',
                    'description' => 'Não há interação clinicamente relevante.',
                    'recommendation' => 'Nenhuma recomendação necessária.',
                ],
            ],
        ]);

        $mockChoice = (object) [
            'message' => (object) [
                'content' => $openAIResponse,
            ],
        ];

        $mockResponse->choices = [$mockChoice];

        $mockChatClient->shouldReceive('create')
            ->once()
            ->andReturn($mockResponse);

        $mockClient->shouldReceive('client')
            ->with('test-key')
            ->andReturn((object) ['chat' => fn () => $mockChatClient]);

        $result = MedicationInteractionService::check($medication1, collect([$medication2->id]));

        $this->assertCount(0, $result);

        $this->assertDatabaseMissing('medication_interactions', [
            'owner_id' => $medication1->id,
            'related_id' => $medication2->id,
        ]);
    }

    public function test_check_updates_existing_interactions(): void
    {
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $existingInteraction = MedicationInteraction::factory()->create([
            'owner_id' => $medication1->id,
            'related_id' => $medication2->id,
            'severity' => 'mild',
            'description' => 'Old description',
        ]);

        // Mock OpenAI client
        $mockClient = Mockery::mock('overload:OpenAI');
        $mockChatClient = Mockery::mock();
        $mockResponse = Mockery::mock(CreateResponse::class);

        $openAIResponse = json_encode([
            'interactions' => [
                [
                    'medication_id' => $medication2->id,
                    'has_interaction' => true,
                    'severity' => 'severe',
                    'description' => 'Updated: Aumenta risco de sangramento.',
                    'recommendation' => 'Evitar uso concomitante.',
                ],
            ],
        ]);

        $mockChoice = (object) [
            'message' => (object) [
                'content' => $openAIResponse,
            ],
        ];

        $mockResponse->choices = [$mockChoice];

        $mockChatClient->shouldReceive('create')
            ->once()
            ->andReturn($mockResponse);

        $mockClient->shouldReceive('client')
            ->with('test-key')
            ->andReturn((object) ['chat' => fn () => $mockChatClient]);

        $result = MedicationInteractionService::check($medication1, collect([$medication2->id]));

        $this->assertCount(1, $result);

        $existingInteraction->refresh();

        $this->assertEquals('severe', $existingInteraction->severity);
        $this->assertEquals('Updated: Aumenta risco de sangramento.', $existingInteraction->description);
    }

    public function test_check_handles_malformed_json_response_gracefully(): void
    {
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        // Mock OpenAI client
        $mockClient = Mockery::mock('overload:OpenAI');
        $mockChatClient = Mockery::mock();
        $mockResponse = Mockery::mock(CreateResponse::class);

        $mockChoice = (object) [
            'message' => (object) [
                'content' => 'invalid json',
            ],
        ];

        $mockResponse->choices = [$mockChoice];

        $mockChatClient->shouldReceive('create')
            ->once()
            ->andReturn($mockResponse);

        $mockClient->shouldReceive('client')
            ->with('test-key')
            ->andReturn((object) ['chat' => fn () => $mockChatClient]);

        $result = MedicationInteractionService::check($medication1, collect([$medication2->id]));

        $this->assertCount(0, $result);
    }

    public function test_check_loads_relationships_on_created_interactions(): void
    {
        $medication1 = Medication::factory()->create(['name' => 'Medication A']);
        $medication2 = Medication::factory()->create(['name' => 'Medication B']);

        // Mock OpenAI client
        $mockClient = Mockery::mock('overload:OpenAI');
        $mockChatClient = Mockery::mock();
        $mockResponse = Mockery::mock(CreateResponse::class);

        $openAIResponse = json_encode([
            'interactions' => [
                [
                    'medication_id' => $medication2->id,
                    'has_interaction' => true,
                    'severity' => 'moderate',
                    'description' => 'Test interaction',
                    'recommendation' => 'Test recommendation',
                ],
            ],
        ]);

        $mockChoice = (object) [
            'message' => (object) [
                'content' => $openAIResponse,
            ],
        ];

        $mockResponse->choices = [$mockChoice];

        $mockChatClient->shouldReceive('create')
            ->once()
            ->andReturn($mockResponse);

        $mockClient->shouldReceive('client')
            ->with('test-key')
            ->andReturn((object) ['chat' => fn () => $mockChatClient]);

        $result = MedicationInteractionService::check($medication1, collect([$medication2->id]));

        $this->assertCount(1, $result);
        $this->assertTrue($result->first()->relationLoaded('owner'));
        $this->assertTrue($result->first()->relationLoaded('related'));
        $this->assertEquals('Medication A', $result->first()->owner->name);
        $this->assertEquals('Medication B', $result->first()->related->name);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
