const socket=io();

const lblOnline=document.getElementById("lblOnline")
const lblOffline=document.getElementById("lblOffline")
const inputUserName=document.getElementById("inputUserName")
const comboboxContainer=document.getElementById("comboboxContainer")
//const inputId=document.getElementById("inputId")
var arrayPlayers;
var selectedPlayer;
var inputCash=document.getElementById("inputCash")

var NamePlayer;

socket.on('connect',()=>{
    //console.log("conectado")
    lblOnline.style.display="block"
    lblOffline.style.display="none"
})

socket.on('disconnect',()=>{
    lblOnline.style.display="none"
    lblOffline.style.display="block"
    //console.log("desconectado")
})

socket.on('send-msj',(payload)=>{
    console.log(payload)
})

socket.on('mensaje-privado',(payload)=>{
    console.log(payload)
})

socket.on(`get-players`,payload=>{
    console.log(payload)
})

socket.on('login',payload=>{
    console.log("alguien se logueo",payload)
    arrayPlayers=payload.uuidPlayers
    CreateSelect(arrayPlayers)
})

socket.on('pagar',payload=>{
    console.log("alguien te pago")
})

socket.on('pagado',payload=>{
    actualizarMonto(payload.newMount)
})

function RegisterUser(){
    let name=inputUserName.value.trim();
    NamePlayer=name;
    const payload={
        name,
        fecha:new Date().getTime()
    }
    socket.emit('login',payload,(players)=>{
        arrayPlayers=players.uuidPlayers
        console.log("desde el server",arrayPlayers)
        CreateSelect(arrayPlayers)
        actualizarMonto(players.monto)
    })
}

function CreateSelect(arrObj){
    let container=document.getElementById("comboboxContainer")
    if(!!document.getElementById("containerPlayers")){
        document.getElementById("containerPlayers").remove()
    }
    let newDiv=document.createElement("div")
    newDiv.id="containerPlayers"

    let newSelect=document.createElement("select")
    newSelect.className="form-select";
    let keys = [...new Set(arrObj.map((obj) => Object.keys(obj)).flat())];
    for(let i=0;i<keys.length;i++){
        let newOption=document.createElement("option")
        newOption.appendChild(document.createTextNode(keys[i]))
        newOption.value=arrayPlayers[i][keys[i]]
        newSelect.appendChild(newOption)
    }
    selectedPlayer=newSelect;
    newDiv.appendChild(newSelect)
    container.appendChild(newDiv)
}

function actualizarMonto(monto){
    document.getElementById("montoPlayer").innerHTML=monto
}

function PagarAUnJugador(){
    let uuid=selectedPlayer.value;
    let nombre=selectedPlayer.options[selectedPlayer.selectedIndex].text
    let monto=inputCash.value
    let payload={
        NamePlayer,
        uuid,
        nombre,
        monto
    }
    socket.emit('pagar',payload,data=>{
        actualizarMonto(data.newMount)
    })
}