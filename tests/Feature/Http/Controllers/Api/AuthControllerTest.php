<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/api/v1/auth';

    public function test_register_with_successful(): void
    {
        $form = UserFactory::new()->unverified()->make()->setAppends([])->toArray();

        $form['password'] = 'password';
        $form['password_confirmation'] = 'password';

        $response = $this->postJson("$this->url/register", $form);

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('auth.register_success'),
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $form['email'],
        ]);
    }

    public function test_login_with_successful(): void
    {
        $user = User::factory()->create();

        $form = [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'PHPUnit Test Device',
        ];

        $response = $this->postJson("$this->url/login", $form);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'access_token',
                'token_type',
            ]);
    }

    public function test_login_with_invalid_credentials(): void
    {
        $form = [
            'email' => $this->faker()->email(),
            'password' => 'password',
            'device_name' => 'PHPUnit Test Device',
        ];

        $response = $this->postJson("$this->url/login", $form);

        $response
            ->assertStatus(422)
            ->assertJson([
                'message' => __('auth.invalid_credentials'),
                'status_code' => 422,
                'code' => 'INVALID_CREDENTIALS'
            ]);
    }

    public function test_login_with_validation_errors(): void
    {
        $form = [
            'email' => $this->faker()->word(),
        ];

        $response = $this->postJson("$this->url/login", $form);

        $response
            ->assertStatus(422)
            ->assertJson([
                'message' => __('errors.validation'),
                'status_code' => 422,
                'code' => 'VALIDATION',
            ]);
    }

    public function test_me_with_successful(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->getJson("$this->url/me");

        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    public function test_me_not_authenticated(): void
    {
        $response = $this->getJson("$this->url/me");

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => __('errors.unauthenticated'),
                'status_code' => 401,
                'code' => 'UNAUTHENTICATED',
            ]);
    }

    public function test_logout_with_successful(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->postJson("$this->url/logout");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('auth.logout')
            ]);
    }

    public function test_logout_without_token(): void
    {
        $response = $this->postJson("$this->url/logout");

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => __('errors.unauthenticated'),
                'status_code' => 401,
                'code' => 'UNAUTHENTICATED'
            ]);
    }
}
