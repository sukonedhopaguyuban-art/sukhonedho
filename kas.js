const API = "https://script.google.com/macros/s/AKfycbzGqsqXcvQCGUJyf829tONGjqh4jKTrKBcoNWkQjVze_tIrQniA2sKI_RL5kDj8Cs2ZVQ/exec"; // ganti dengan URL Web App Apps Script

let role = "";

function login() {
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(r => r.json())
  .then(d => {
    if(d.status){
      role = d.role;
      document.getElementById("loginDiv").style.display = "none";
      document.getElementById("mainDiv").style.display = "block";
      if(role==="admin") document.getElementById("adminForm").style.display="block";
      loadKas();
    } else {
      alert(d.msg);
    }
  });
}

function loadKas() {
  fetch(API, {
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action:"getKas",
      bulan: document.getElementById("bulan").value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    const tbody = document.querySelector("#tabel tbody");
    tbody.innerHTML = "";
    let total = 0;
    d.data.forEach(x=>{
      total += x[5]*(x[3]=="Masuk"?1:-1);
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${x[1]}</td>
        <td>${x[2]}</td>
        <td>${x[3]}</td>
        <td>${x[5]}</td>
        <td>${x[4]}</td>
        <td>${x[6]?`<a href="${x[6]}" target="_blank">Lihat</a>`:"-"}</td>
        <td>${role==="admin"?`<button onclick="deleteKas(${x[0]})">Hapus</button>`:"-"}</td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById("totalKas").innerText = total;
  });
}

function addKas() {
  const f = document.getElementById("foto").files[0];
  if(f){
    const r = new FileReader();
    r.onload = ()=>{
      fetch(API,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          action:"addKas",
          tanggal: document.getElementById("tgl").value,
          nama: document.getElementById("nama").value,
          jenis: document.getElementById("jenis").value,
          jumlah: document.getElementById("jumlah").value,
          keterangan: document.getElementById("ket").value,
          foto: r.result.split(",")[1],
          mime: f.type,
          namaFile: f.name
        })
      }).then(()=>loadKas());
    };
    r.readAsDataURL(f);
  } else {
    fetch(API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        action:"addKas",
        tanggal: document.getElementById("tgl").value,
        nama: document.getElementById("nama").value,
        jenis: document.getElementById("jenis").value,
        jumlah: document.getElementById("jumlah").value,
        keterangan: document.getElementById("ket").value,
        foto: null
      })
    }).then(()=>loadKas());
  }
}

function deleteKas(id){
  if(confirm("Hapus data ini?")){
    fetch(API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ action:"deleteKas", id:id })
    }).then(()=>loadKas());
  }
}

function logout(){
  location.href="../index.html"; // kembali ke menu utama
}

