<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SobatController;
use App\Http\Controllers\HonorController;
use App\Http\Controllers\SurveiController;
use App\Http\Controllers\NamaSurveiController;
use App\Http\Controllers\TimSurveiController;
use App\Http\Controllers\AuthController;

// Route default API
Route::get('/', function () {
    return response()->json(['message' => 'API is working']);
});

// Public routes
// Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Route::get('/login/{email}/{password}', [AuthController::class, 'loginViaLink']);

// Protected routes, versioned under /v1 and guarded by sanctum
Route::prefix('log')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);


    // SOBAT
    Route::get('/sobat', [SobatController::class, 'index']);
    Route::get('/sobat/{id}', [SobatController::class, 'show']);
    Route::post('/sobat', [SobatController::class, 'store']);
    Route::put('/sobat/{id}', [SobatController::class, 'update']);
    Route::delete('/sobat/{id}', [SobatController::class, 'destroy']);
    Route::post('/sobats/{id}/honors', [SobatController::class, 'storeHonor']);

    // HONOR
    Route::get('/honor', [HonorController::class, 'index']);
    Route::get('/honor/{id}', [HonorController::class, 'show']);
    Route::post('/honor', [HonorController::class, 'store']);
    Route::put('/honor/{id}', [HonorController::class, 'update']);
    Route::delete('/honor/{id}', [HonorController::class, 'destroy']);

    // SURVEI
    Route::get('/survei', [SurveiController::class, 'index']);
    Route::get('/survei/{id}', [SurveiController::class, 'show']);
    Route::post('/survei', [SurveiController::class, 'store']);
    Route::put('/survei/{id}', [SurveiController::class, 'update']);
    Route::delete('/survei/{id}', [SurveiController::class, 'destroy']);

    //NAMA SURVEI
    Route::get('/nama_survei', [NamaSurveiController::class, 'index']);
    Route::get('/nama_survei/{id}', [NamaSurveiController::class, 'show']);
    Route::post('/nama_survei', [NamaSurveiController::class, 'store']);
    Route::put('/nama_survei/{id}', [NamaSurveiController::class, 'update']);
    Route::delete('/nama_survei/{id}', [NamaSurveiController::class, 'destroy']);

    //TIM SURVEI
    Route::get('/tim_survei', [TimSurveiController::class, 'index']);
    Route::get('/tim_survei/{id}', [TimSurveiController::class, 'show']);
    Route::post('/tim_survei', [TimSurveiController::class, 'store']);
    Route::put('/tim_survei/{id}', [TimSurveiController::class, 'update']);
    Route::delete('/tim_survei/{id}', [TimSurveiController::class, 'destroy']);
});

Route::get('/sobat', [SobatController::class, 'index']);
Route::get('/sobat/{id}', [SobatController::class, 'show']);
Route::post('/sobat', [SobatController::class, 'store']);
Route::put('/sobat/{id}', [SobatController::class, 'update']);
Route::delete('/sobat/{id}', [SobatController::class, 'destroy']);
Route::post('/sobats/{id}/honors', [SobatController::class, 'storeHonor']);

// HONOR
Route::get('/honor', [HonorController::class, 'index']);
Route::get('/honor/{id}', [HonorController::class, 'show']);
Route::post('/honor', [HonorController::class, 'store']);
Route::put('/honor/{id}', [HonorController::class, 'update']);
Route::delete('/honor/{id}', [HonorController::class, 'destroy']);

// SURVEI
Route::get('/survei', [SurveiController::class, 'index']);
Route::get('/survei/{id}', [SurveiController::class, 'show']);
Route::post('/survei', [SurveiController::class, 'store']);
Route::put('/survei/{id}', [SurveiController::class, 'update']);
Route::delete('/survei/{id}', [SurveiController::class, 'destroy']);

//NAMA SURVEI
Route::get('/nama_survei', [NamaSurveiController::class, 'index']);
Route::get('/nama_survei/{id}', [NamaSurveiController::class, 'show']);
Route::post('/nama_survei', [NamaSurveiController::class, 'store']);
Route::put('/nama_survei/{id}', [NamaSurveiController::class, 'update']);
Route::delete('/nama_survei/{id}', [NamaSurveiController::class, 'destroy']);

//TIM SURVEI
Route::get('/tim_survei', [TimSurveiController::class, 'index']);
Route::get('/tim_survei/{id}', [TimSurveiController::class, 'show']);
Route::post('/tim_survei', [TimSurveiController::class, 'store']);
Route::put('/tim_survei/{id}', [TimSurveiController::class, 'update']);
Route::delete('/tim_survei/{id}', [TimSurveiController::class, 'destroy']);
