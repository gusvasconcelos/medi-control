<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Faker\Factory;
use Faker\Generator;

abstract class TestCase extends BaseTestCase
{
    public function faker(): Generator
    {
        return Factory::create(config('app.locale'));
    }

    public function actingAsUser(User $user, $guard = null): self
    {
        $token = auth('api')->tokenById($user->id);

        return $this->withHeaders([
            'Authorization' => 'Bearer' . $token
        ]);
    }
}
