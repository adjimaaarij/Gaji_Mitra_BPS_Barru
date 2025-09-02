<?php

namespace App\Http\Controllers;

use App\Models\Survei;
use Illuminate\Http\Request;

class SurveiController extends Controller
{
    /**
     * Ambil semua survei beserta relasi honors
     */
    public function index()
    {
        $surveis = Survei::with('honors')->get();
        return response()->json($surveis, 200);
    }

    /**
     * Tambah survei baru
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'jenis_survei' => 'required|string|max:255|unique:survei,jenis_survei',
        ]);

        $survei = Survei::create($data);
        return response()->json($survei, 201);
    }

    /**
     * Detail survei tertentu (beserta honors)
     */
    public function show($id)
    {
        $survei = Survei::with('honors')->findOrFail($id);
        return response()->json($survei, 200);
    }

    /**
     * Update survei
     */
    public function update(Request $request, $id)
    {
        $survei = Survei::findOrFail($id);

        $data = $request->validate([
            'jenis_survei' => 'sometimes|string|max:255|unique:survei,jenis_survei,' . $id . ',id_survei',
        ]);

        $survei->update($data);
        return response()->json($survei, 200);
    }

    /**
     * Hapus survei (beserta honors terkait)
     */
    public function destroy($id)
    {
        $survei = Survei::findOrFail($id);

        // hapus honors terkait agar tidak orphan
        $survei->honors()->delete();
        $survei->delete();

        return response()->json(['message' => 'Survei deleted successfully'], 200);
    }
}
