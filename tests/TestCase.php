<?php

namespace Tests;

use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use WithFaker;

    protected int $empresaId = 1;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        $server = $this->transformHeadersToServerVars($this->defaultHeaders) + $server;

        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }

    protected function actingAsUser(?User $user = null)
    {
        $user = $user ?? User::factory()->create();

        $token = auth('api')->tokenById($user->id);

        $this->withHeaders(['Authorization' => "Bearer $token"]);

        return $this;
    }

    protected function assertPaginate(TestResponse $response, array $dataElementsStructure = [])
    {
        $response->assertJsonStructure([
            'current_page',
            'data' => [
                '*' => $dataElementsStructure,
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                [
                    'url',
                    'label',
                    'active',
                ],
                [
                    'url',
                    'label',
                    'active',
                ],
                [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);

        return $response;
    }

    protected function assertDoesntHaveOpenedTransactionInAction()
    {
        $this->assertEquals(1, DB::transactionLevel(), 'Há transações abertas no código que foi testado.');
    }

    protected function tearDown(): void
    {
        while (DB::transactionLevel() > 1) {
            DB::rollBack();
        }

        parent::tearDown();
    }
}
