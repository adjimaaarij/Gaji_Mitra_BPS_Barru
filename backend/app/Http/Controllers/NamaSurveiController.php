<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NamaSurvei;

class NamaSurveiController extends Controller
{
    /**
     * Tampilkan semua data NamaSurvei
     */
    public function index()
    {
        // Ambil semua nama survei beserta honors (jika ada relasi)
        $surveis = NamaSurvei::with('honors')->get();

        return response()->json([
            'status' => 'success',
            'data'   => $surveis
        ]);
    }

    /**
     * Simpan data baru NamaSurvei
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_survei' => 'required|string|max:255',
        ]);

        $survei = NamaSurvei::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Nama survei berhasil ditambahkan',
            'data'    => $survei
        ], 201);
    }

    /**
     * Tampilkan detail NamaSurvei tertentu
     */
    public function show($id)
    {
        $survei = NamaSurvei::with('honors')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $survei
        ]);
    }

    /**
     * Update NamaSurvei tertentu
     */
    public function update(Request $request, $id)
    {
        $survei = NamaSurvei::findOrFail($id);

        $validated = $request->validate([
            'nama_survei' => 'required|string|max:255',
        ]);

        $survei->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Nama survei berhasil diperbarui',
            'data'    => $survei
        ]);
    }

    /**
     * Hapus NamaSurvei tertentu
     */
    public function destroy($id)
    {
        $survei = NamaSurvei::findOrFail($id);
        $survei->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Nama survei berhasil dihapus'
        ]);
    }
}
