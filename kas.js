const API = "https://script.google.com/macros/s/AKfycbxMcv8ZFEHMh9P7NFOp5o4kMvGEEBrj8axMZZFvrNHPtYjqoDSXGFICnpvckHpwo11b2A/exec"; // ganti dengan URL Web App

let role="";

function login(){
  fetch(API,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      action:"login",
      email:document.getElementById("email").value,
      password:document.getElementById("password").value
    })
  }).then(r=>r.json()).then(d=>{
    if(d.status){
      role=d.role;
      document.getElementById("loginDiv").style.display="none";
      document.getElementById("mainDiv").style.display="block";
      if(role!="admin") document.getElementById("adminForm").style.display="none";
      loadKas();
    } else alert(d.msg);
  });
}

function loadKas(){
  fetch(API,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      action:"getKas",
      bulan: document.getElementById("bulan").value || null
    })
  }).then(r=>r.json()).then(d=>{
    const tbody=document.querySelector("#tabel tbody");
    tbody.innerHTML="";
    d.data.forEach(x=>{
      let tr=document.createElement("tr");
      tr.innerHTML=`
        <td>${x[0]}</td>
        <td>${x[1]}</td>
        <td>${x[2]}</td>
        <td>${x[3]}</td>
        <td>${x[4]}</td>
        <td>${x[5]?`<a href="${x[5]}" target="_blank">Lihat</a>`:"-"}</td>
        <td>${role==="admin"?`<button onclick="deleteKas(${x[0]})">Hapus</button>`:"-"}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function addKas(){
  const f=document.getElementById("foto").files[0];
  if(f){
    const r=new FileReader();
    r.onload=()=>{
      fetch(API,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          action:"addKas",
          tanggal:document.getElementById("tgl").value,
          nama:document.getElementById("nama").value,
          jenis:document.getElementById("jenis").value,
          keterangan:document.getElementById("ket").value,
          foto:r.result.split(",")[1],
          mime:f.type,
          namaFile:f.name
        })
      }).then(()=>loadKas());
    }
    r.readAsDataURL(f);
  } else {
    fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        action:"addKas",
        tanggal:document.getElementById("tgl").value,
        nama:document.getElementById("nama").value,
        jenis:document.getElementById("jenis").value,
        keterangan:document.getElementById("ket").value
      })
    }).then(()=>loadKas());
  }
}

function deleteKas(id){
  if(confirm("Hapus data ini?")){
    fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"deleteKas", id:id})
    }).then(()=>loadKas());
  }
}

function logout(){
  location.href="index.html";
}

