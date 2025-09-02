<?php

namespace App\Http\Controllers;

use App\Models\Honor;
use App\Models\Sobat;
use Illuminate\Http\Request;

class HonorController extends Controller
{
    public function index()
    {
        return response()->json(
            Honor::with(['sobat', 'survei', 'namaSurvei'])->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_sobat'      => 'required|exists:sobat,id_sobat',
            'id_survei'     => 'required|exists:survei,id_survei',
            'id_nama_survei'=> 'required|exists:nama_survei,id_nama_survei',
            'nilai_honor'   => 'required|numeric',
            'nilai_pulsa'   => 'required|numeric',
            'tanggal_input' => 'required|date',
            'bulan'         => 'required|date',
        ]);

        $honor = Honor::create($data);

        // update total honor & pulsa untuk Sobat
        $this->updateTotalAkumulasi($data['id_sobat']);

        return response()->json($honor, 201);
    }

    public function show($id)
    {
        $honor = Honor::with(['sobat', 'survei', 'namaSurvei'])->findOrFail($id);
        return response()->json($honor);
    }

    public function update(Request $request, $id)
    {
        $honor = Honor::findOrFail($id);

        $data = $request->validate([
            'id_sobat'      => 'sometimes|exists:sobat,id_sobat',
            'id_survei'     => 'sometimes|exists:survei,id_survei',
            'id_nama_survei'=> 'sometimes|exists:nama_survei,id_nama_survei',
            'nilai_honor'   => 'sometimes|numeric',
            'nilai_pulsa'   => 'sometimes|numeric',
            'tanggal_input' => 'sometimes|date',
            'bulan'         => 'sometimes|date',
        ]);

        $honor->update($data);

        // id_sobat baru atau lama
        $sobatId = $data['id_sobat'] ?? $honor->id_sobat;
        $this->updateTotalAkumulasi($sobatId);

        return response()->json($honor);
    }

    public function destroy($id)
    {
        $honor = Honor::findOrFail($id);
        $sobatId = $honor->id_sobat;
        $honor->delete();

        $this->updateTotalAkumulasi($sobatId);

        return response()->json(['message' => 'Honor deleted successfully']);
    }

    // update total honor & pulsa di tabel sobat
    protected function updateTotalAkumulasi($id_sobat)
    {
        $totalHonor = Honor::where('id_sobat', $id_sobat)->sum('nilai_honor');
        $totalPulsa = Honor::where('id_sobat', $id_sobat)->sum('nilai_pulsa');

        Sobat::where('id_sobat', $id_sobat)->update([
            'total_honor' => $totalHonor,
            'total_pulsa' => $totalPulsa,
        ]);
    }
}
