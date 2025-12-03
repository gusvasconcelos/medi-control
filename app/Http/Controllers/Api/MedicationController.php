<?php

namespace App\Http\Controllers\Api;

use App\Models\Medication;
use Illuminate\Http\Request;
use App\Packages\Filter\FilterQ;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class MedicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $medications = FilterQ::applyWithPagination(Medication::query(), collect($request->all()));

        return response()->json($medications);
    }
}
