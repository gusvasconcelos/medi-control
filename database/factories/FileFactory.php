<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    protected $model = File::class;

    public function definition(): array
    {
        $extensions = ['jpg', 'png', 'pdf', 'doc', 'docx', 'xlsx'];
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        $extension = fake()->randomElement($extensions);
        $originalName = fake()->word() . '.' . $extension;

        return [
            'uploaded_by' => User::factory(),
            'fileable_type' => 'App\\Models\\User',
            'fileable_id' => User::factory(),
            'original_name' => $originalName,
            'stored_name' => fake()->uuid() . '.' . $extension,
            'path' => fake()->uuid() . '/user/' . fake()->uuid() . '.' . $extension,
            'disk' => 's3',
            'mime_type' => $mimeTypes[$extension],
            'size' => fake()->numberBetween(1024, 10485760),
            'visibility' => fake()->randomElement(['private', 'public', 'shared']),
            'metadata' => [
                'upload_method' => fake()->randomElement(['base64', 'multipart', 'url']),
            ],
            'active' => true,
        ];
    }

    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'private',
        ]);
    }

    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'public',
        ]);
    }

    public function shared(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'shared',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => false,
        ]);
    }
}
