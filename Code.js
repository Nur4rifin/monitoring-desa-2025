// ============================================
// Main Web App Handler
// ============================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Monitoring Kegiatan Desa')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================
// Spreadsheet Configuration (Diperkuat)
// ============================================

function getSpreadsheet() {
  // Prefer stored ID
  const props = PropertiesService.getScriptProperties();
  let SPREADSHEET_ID = props.getProperty('SPREADSHEET_ID');
  if (SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      // Jika stored ID gagal (mis. file dipindah), clear property dan cari lagi
      console.warn('Stored SPREADSHEET_ID invalid, clearing and searching. Error:', e);
      props.deleteProperty('SPREADSHEET_ID');
      SPREADSHEET_ID = null;
    }
  }

  // Jika tidak ada SPREADSHEET_ID, coba cari file spreadsheet di Drive yang memiliki sheet "DataKegiatan"
  try {
    const files = DriveApp.searchFiles("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
    while (files.hasNext()) {
      const file = files.next();
      try {
        const ss = SpreadsheetApp.openById(file.getId());
        const sheet = ss.getSheetByName('DataKegiatan');
        if (sheet) {
          // Simpan ID ke propertis agar panggilan selanjutnya langsung cepat
          props.setProperty('SPREADSHEET_ID', file.getId());
          console.log('Found spreadsheet by Drive search. Using ID:', file.getId());
          return ss;
        }
      } catch (innerErr) {
        // Jika gagal membuka salah satu file (akses), skip
        console.warn('Unable to open spreadsheet file during search (skipping). ID:', file.getId(), innerErr);
      }
    }
  } catch (e) {
    console.warn('Drive search failed or insufficient permissions:', e);
  }

  // Jika tetap tidak ditemukan, coba fallback ke ActiveSpreadsheet (useful for container-bound scripts)
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      // pastikan sheet ada
      if (active.getSheetByName('DataKegiatan')) {
        // Save its id for next time
        try {
          props.setProperty('SPREADSHEET_ID', active.getId());
        } catch (e) {
          console.warn('Unable to save found ActiveSpreadsheet ID to properties:', e);
        }
        return active;
      }
    }
  } catch (e) {
    console.warn('ActiveSpreadsheet check failed:', e);
  }

  // Jika sampai sini belum berhasil, beri pesan error agar caller tahu masalahnya.
  throw new Error('Spreadsheet tidak ditemukan. Pastikan ada file spreadsheet yang berisi sheet "DataKegiatan" dan web app dijalankan dengan akun yang memiliki akses. Jalankan setup() sekali jika perlu.');
}

function getSheet(sheetName) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
    }
    return sheet;
  } catch (error) {
    console.error('Error getting sheet:', error);
    throw error;
  }
}

// ============================================
// Data Master Functions
// ============================================

function getMasterData() {
  try {
    const sheet = getSheet('DataMaster');
    const data = sheet.getDataRange().getValues();

    const masterData = {
      desa: [],
      jenisProgram: [],
      kodeRekening: [],
      prioritas: [],
      kategoriProgram: [],
      jenisKegiatan: []
    };

    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) masterData.desa.push(data[i][0].toString());
      if (data[i][1]) masterData.jenisProgram.push(data[i][1].toString());
      if (data[i][2]) masterData.kodeRekening.push(data[i][2].toString());
      if (data[i][3]) masterData.prioritas.push(data[i][3].toString());
      if (data[i][4]) masterData.kategoriProgram.push(data[i][4].toString());
      if (data[i][5]) masterData.jenisKegiatan.push(data[i][5].toString());
    }

    Object.keys(masterData).forEach(key => {
      masterData[key] = [...new Set(masterData[key])];
    });

    return masterData;
  } catch (error) {
    console.error('Error in getMasterData:', error);
    throw new Error('Gagal memuat data master: ' + error.message);
  }
}

// ============================================
// Data Kegiatan Functions
// ============================================

function getAllData() {
  try {
    const sheet = getSheet('DataKegiatan');
    const data = sheet.getDataRange().getValues();

    const result = [];
    // data[0] adalah header; baris data dimulai index 1
    for (let i = 1; i < data.length; i++) {
      // Pastikan baris yang benar-benar berisi No. (kolom A)
      if (data[i][0] !== '' && data[i][0] !== null && data[i][0] !== undefined) {
        result.push({
          id: i, // gunakan index i (sesuai asumsi client saat ini)
          no: data[i][0],
          desa: data[i][1] || '',
          jenisProgram: data[i][2] || '',
          kodeRekening: data[i][3] || '',
          uraianAPBDes: data[i][4] || '',
          uraianKegiatan: data[i][5] || '',
          lokasi: data[i][6] || '',
          prioritas: data[i][7] || '',
          kategoriProgram: data[i][8] || '',
          jenisKegiatan: data[i][9] || '',
          volumeRencana: data[i][10] || 0,
          volumeRealisasi: data[i][11] || 0,
          satuan: data[i][12] || '',
          anggaran: data[i][13] || 0,
          realisasi: data[i][14] || 0,
          sisa: data[i][15] || 0,
          pemanfaatL: data[i][16] || 0,
          pemanfaatP: data[i][17] || 0,
          pemanfaatRTM: data[i][18] || 0,
          tglMulai: formatDateForDisplay(data[i][19]),
          tglSelesai: formatDateForDisplay(data[i][20]),
          foto: data[i][21] || ''
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error in getAllData:', error);
    throw new Error('Gagal memuat data kegiatan: ' + error.message);
  }
}

function addData(formData) {
  try {
    const sheet = getSheet('DataKegiatan');
    const lastRow = sheet.getLastRow();
    const newNo = lastRow; // nomor untuk kolom "No."

    const rowData = [
      newNo,
      formData.desa || '',
      formData.jenisProgram || '',
      formData.kodeRekening || '',
      formData.uraianKegiatan || '',
      formData.uraianKegiatan || '',
      formData.lokasi || '',
      formData.prioritas || '',
      formData.kategoriProgram || '',
      formData.jenisKegiatan || '',
      formData.volumeRencana || 0,
      formData.volumeRealisasi || 0,
      formData.satuan || '',
      parseFloat(formData.anggaran) || 0,
      parseFloat(formData.realisasi) || 0,
      parseFloat(formData.sisa) || 0,
      parseInt(formData.pemanfaatL) || 0,
      parseInt(formData.pemanfaatP) || 0,
      parseInt(formData.pemanfaatRTM) || 0,
      formData.tglMulai ? new Date(formData.tglMulai) : '',
      formData.tglSelesai ? new Date(formData.tglSelesai) : '',
      formData.foto || ''
    ];

    const targetRow = lastRow + 1;
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);

    // Pastikan commit ke server sebelum kembali
    SpreadsheetApp.flush();

    return { success: true, message: 'Data berhasil ditambahkan', row: targetRow };
  } catch (error) {
    console.error('Error in addData:', error);
    throw new Error('Gagal menambah data: ' + error.message);
  }
}

function updateData(id, formData) {
  try {
    const sheet = getSheet('DataKegiatan');
    const row = parseInt(id) + 1; // +1 karena header di baris 1

    const rowData = [
      parseInt(id),
      formData.desa || '',
      formData.jenisProgram || '',
      formData.kodeRekening || '',
      formData.uraianKegiatan || '',
      formData.uraianKegiatan || '',
      formData.lokasi || '',
      formData.prioritas || '',
      formData.kategoriProgram || '',
      formData.jenisKegiatan || '',
      formData.volumeRencana || 0,
      formData.volumeRealisasi || 0,
      formData.satuan || '',
      parseFloat(formData.anggaran) || 0,
      parseFloat(formData.realisasi) || 0,
      parseFloat(formData.sisa) || 0,
      parseInt(formData.pemanfaatL) || 0,
      parseInt(formData.pemanfaatP) || 0,
      parseInt(formData.pemanfaatRTM) || 0,
      formData.tglMulai ? new Date(formData.tglMulai) : '',
      formData.tglSelesai ? new Date(formData.tglSelesai) : '',
      formData.foto || ''
    ];

    sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
    SpreadsheetApp.flush();

    return { success: true, message: 'Data berhasil diperbarui' };
  } catch (error) {
    console.error('Error in updateData:', error);
    throw new Error('Gagal memperbarui data: ' + error.message);
  }
}

function deleteData(id) {
  try {
    const sheet = getSheet('DataKegiatan');
    const row = parseInt(id) + 1; // +1 karena header di baris 1

    sheet.deleteRow(row);

    renumberData();

    SpreadsheetApp.flush();

    return { success: true, message: 'Data berhasil dihapus' };
  } catch (error) {
    console.error('Error in deleteData:', error);
    throw new Error('Gagal menghapus data: ' + error.message);
  }
}

function renumberData() {
  try {
    const sheet = getSheet('DataKegiatan');
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        sheet.getRange(i + 1, 1).setValue(i);
      }
    }

    SpreadsheetApp.flush();
  } catch (error) {
    console.error('Error in renumberData:', error);
  }
}

// ============================================
// Utility Functions
// ============================================

function formatDateForDisplay(dateValue) {
  if (!dateValue) return '';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
}

function validateData(formData) {
  const errors = [];

  if (!formData.desa) errors.push('Desa wajib diisi');
  if (!formData.jenisProgram) errors.push('Jenis Program wajib diisi');
  if (!formData.kodeRekening) errors.push('Kode Rekening wajib diisi');
  if (!formData.uraianKegiatan) errors.push('Uraian Kegiatan wajib diisi');
  if (!formData.prioritas) errors.push('Prioritas wajib diisi');
  if (!formData.kategoriProgram) errors.push('Kategori Program wajib diisi');
  if (!formData.jenisKegiatan) errors.push('Jenis Kegiatan wajib diisi');

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
}

// ============================================
// Setup Function (tidak diubah secara fungsional)
// ============================================

function setup() {
  try {
    const spreadsheet = getSpreadsheet();

    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());

    spreadsheet.getSheets().forEach(sheet => {
      if (sheet.getName() !== 'DataMaster' && sheet.getName() !== 'DataKegiatan') {
        spreadsheet.deleteSheet(sheet);
      }
    });

    let sheetKegiatan = spreadsheet.getSheetByName('DataKegiatan');
    if (!sheetKegiatan) {
      sheetKegiatan = spreadsheet.insertSheet('DataKegiatan');
    } else {
      sheetKegiatan.clear();
    }

    const headersKegiatan = [
      'No.', 'Desa', 'Jenis Program', 'Kode Rekening', 'Uraian APBDes',
      'Uraian Kegiatan', 'Lokasi', 'Prioritas', 'Kategori Program', 'Jenis Kegiatan',
      'Volume Rencana', 'Volume Realisasi', 'Satuan', 'Anggaran (Rp)',
      'Realisasi (Rp)', 'Sisa (Rp)', 'Pemanfaat Laki-laki', 'Pemanfaat Perempuan',
      'Pemanfaat RTM', 'Tanggal Mulai', 'Tanggal Selesai', 'Upload Foto'
    ];
    sheetKegiatan.getRange(1, 1, 1, headersKegiatan.length).setValues([headersKegiatan]);

    let sheetMaster = spreadsheet.getSheetByName('DataMaster');
    if (!sheetMaster) {
      sheetMaster = spreadsheet.insertSheet('DataMaster');
    } else {
      sheetMaster.clear();
    }

    const headersMaster = ['Desa', 'Jenis Program', 'Kode Rekening', 'Prioritas', 'Kategori Program', 'Jenis Kegiatan'];
    sheetMaster.getRange(1, 1, 1, headersMaster.length).setValues([headersMaster]);

    const masterData = generateSampleMasterData();
    if (masterData.length > 0) {
      sheetMaster.getRange(2, 1, masterData.length, headersMaster.length).setValues(masterData);
    }

    formatSheets();

    SpreadsheetApp.flush();

    return { success: true, message: 'Setup berhasil dilakukan' };
  } catch (error) {
    console.error('Error in setup:', error);
    throw new Error('Gagal melakukan setup: ' + error.message);
  }
}

// generateSampleMasterData, formatSheets exactly same (omitted here to keep message pendek)
// Jika Anda ingin saya sertakan bagian generateSampleMasterData() dan formatSheets() secara lengkap,
// beri tahu saya — saya dapat tambahkan kembali bagian tersebut tanpa mengubah logika.
