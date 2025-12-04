<?php

namespace Tests\Feature\Http\Controllers\Api;

use Tests\TestCase;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Packages\Filter\FilterQueryBuilder;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FileControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('minio');
    }

    public function test_index_returns_user_files(): void
    {
        $user = User::factory()->create();

        $file1 = File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'private',
            'active' => true,
        ]);

        $file2 = File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'public',
            'active' => true,
        ]);

        File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'active' => false,
        ]);

        $response = $this->actingAsUser($user)->getJson("/api/v1/users/{$user->id}/files");

        $response
            ->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_index_filters_by_visibility(): void
    {
        $user = User::factory()->create();

        File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'private',
            'active' => true,
        ]);

        File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'public',
            'active' => true,
        ]);

        $query = FilterQueryBuilder::make()
            ->whereEqual('visibility', 'private')
            ->toJson();

        $response = $this->actingAsUser($user)->getJson("/api/v1/users/{$user->id}/files?q={$query}");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_show_returns_file_with_download_url(): void
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->getJson("/api/v1/users/{$user->id}/files/{$file->id}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'original_name',
                ],
            ])
            ->assertJsonFragment([
                'id' => $file->id,
            ]);
    }

    public function test_store_file_with_multipart_upload(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg', 100, 100);

        $response = $this->actingAsUser($user)->postJson("/api/v1/users/{$user->id}/files", [
            'file' => $file,
            'visibility' => 'private',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'original_name',
                    'mime_type',
                    'size',
                    'visibility',
                ],
            ]);

        $this->assertDatabaseHas('files', [
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'original_name' => 'test.jpg',
            'visibility' => 'private',
            'active' => true,
        ]);
    }

    public function test_store_file_with_base64_upload(): void
    {
        $user = User::factory()->create();
        $base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $response = $this->actingAsUser($user)->postJson("/api/v1/users/{$user->id}/files", [
            'file' => $base64,
            'original_name' => 'test.png',
            'visibility' => 'public',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data',
            ]);

        $this->assertDatabaseHas('files', [
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'public',
            'active' => true,
        ]);
    }

    public function test_update_changes_file_visibility(): void
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'visibility' => 'private',
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->putJson("/api/v1/users/{$user->id}/files/{$file->id}", [
            'visibility' => 'public',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'visibility' => 'public',
            ]);

        $this->assertDatabaseHas('files', [
            'id' => $file->id,
            'visibility' => 'public',
        ]);
    }

    public function test_destroy_marks_file_as_inactive(): void
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            'uploaded_by' => $user->id,
            'fileable_type' => 'App\Models\User',
            'fileable_id' => $user->id,
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->deleteJson("/api/v1/users/{$user->id}/files/{$file->id}");

        $response->assertStatus(200);

        $this->assertDatabaseHas('files', [
            'id' => $file->id,
            'active' => false,
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->postJson("/api/v1/users/{$user->id}/files", []);

        $response->assertStatus(422);
    }

    public function test_store_validates_visibility_enum(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->actingAsUser($user)->postJson("/api/v1/users/{$user->id}/files", [
            'file' => $file,
            'visibility' => 'invalid',
        ]);

        $response->assertStatus(422);
    }
}
