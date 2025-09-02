<?php

namespace App\Http\Controllers;

use App\Models\Sobat;
use Illuminate\Http\Request;

class SobatController extends Controller
{
    /**
     * Ambil semua sobat dengan relasi honors
     */
    public function index()
    {
        $sobats = Sobat::with('honors')->get();

        return response()->json($sobats, 200);
    }

    /**
     * Tambah data sobat baru
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_sobat' => 'required|string|unique:sobat,id_sobat', // wajib unik
            'nama'     => 'required|string|max:255',
            'email'    => 'required|email|unique:sobat,email',
        ]);

        // Default honor & pulsa 0
        $data['total_honor'] = 0.00;
        $data['total_pulsa'] = 0.00;

        $sobat = Sobat::create($data);

        return response()->json($sobat, 201);
    }

    /**
     * Detail 1 sobat dengan honors
     */
    public function show($id)
    {
        $sobat = Sobat::with('honors')->findOrFail($id);

        return response()->json($sobat, 200);
    }

    /**
     * Update sobat
     */
    public function update(Request $request, $id)
    {
        $sobat = Sobat::findOrFail($id);

        $data = $request->validate([
            'id_sobat'     => 'sometimes|string|unique:sobat,id_sobat,' . $id . ',id_sobat',
            'nama'         => 'sometimes|string|max:255',
            'email'        => 'sometimes|email|unique:sobat,email,' . $id . ',id_sobat',
            'total_honor'  => 'sometimes|numeric|min:0',
            'total_pulsa'  => 'sometimes|numeric|min:0',
        ]);

        $sobat->update($data);

        return response()->json($sobat, 200);
    }

    /**
     * Hapus sobat + honors terkait
     */
    public function destroy($id)
    {
        $sobat = Sobat::findOrFail($id);

        // Jika ingin cascade delete honors terkait
        $sobat->honors()->delete();

        $sobat->delete();

        return response()->json([
            'message' => 'Sobat deleted successfully'
        ], 200);
    }
}
