<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TimSurvei;

class TimSurveiController extends Controller
{
    /**
     * Tampilkan semua TimSurvei dengan daftar NamaSurvei.
     */
    public function index()
    {
        $timSurveis = TimSurvei::with('namaSurveis')->get();

        return response()->json([
            'status' => 'success',
            'data'   => $timSurveis
        ]);
    }

    /**
     * Simpan TimSurvei baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_tim_survei' => 'required|string|max:255',
        ]);

        $tim = TimSurvei::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Tim survei berhasil ditambahkan',
            'data'    => $tim
        ], 201);
    }

    /**
     * Tampilkan detail TimSurvei tertentu dengan NamaSurvei.
     */
    public function show($id)
    {
        $tim = TimSurvei::with('namaSurveis')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $tim
        ]);
    }

    /**
     * Update TimSurvei tertentu.
     */
    public function update(Request $request, $id)
    {
        $tim = TimSurvei::findOrFail($id);

        $validated = $request->validate([
            'nama_tim_survei' => 'required|string|max:255',
        ]);

        $tim->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Tim survei berhasil diperbarui',
            'data'    => $tim
        ]);
    }

    /**
     * Hapus TimSurvei tertentu.
     */
    public function destroy($id)
    {
        $tim = TimSurvei::findOrFail($id);
        $tim->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Tim survei berhasil dihapus'
        ]);
    }
}
