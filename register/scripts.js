var rectangle = document.getElementById("rectangle");
if (rectangle) {
  rectangle.addEventListener("click", function (e) {
    window.location.href = "./desktop-2.html";
  });
}

let previousColorFrame34 = null;

function toggleColor(element) {
  if (element.style.backgroundColor === 'var(--color-khaki)') {
    // Jika warnanya sudah diubah, kembalikan ke warna sebelumnya
    element.style.backgroundColor = previousColorFrame34 || 'var(--color-gainsboro)'; // Gunakan warna sebelumnya atau default gainsboro
  } else {
    // Simpan warna sebelumnya dan ubah warna latar belakang
    previousColorFrame34 = element.style.backgroundColor;
    element.style.backgroundColor = 'var(--color-khaki)'; // Ganti dengan warna yang diinginkan
  }
}
