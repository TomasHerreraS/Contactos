formulario = document.querySelector('#formulario');
nombreUser = document.querySelector('#fname');
celular = document.querySelector('#phone');
direccion = document.querySelector('#adress');
nameError = document.querySelector('#nameError');
phoneError = document.querySelector('#phoneError');
adressError = document.querySelector('#adressError');
cardDatos = document.querySelector('#cardDatos'); //Donde mostraremos el contenido del template
templateForm = document.querySelector('#templateDatos').content;

regExpNombre = /^[a-zA-ZáéíóúÁÉÍÓÚ']{3,}$/i;
regExpCelular = /^(\d{4})[ ](\d{4})$/;
regExpAdress = /^[a-zA-ZZáéíóúÁÉÍÓÚ]{5,}[ ]#\d{4}$/ ; //Falta validar para insertar esquinas.

let contactos = [];


//Se crea el objeto para posteriormente ser guardado en el array contactos
const agregarContacto = (nombre,numero,direccion) => {
    
    const objetoContacto = {
        id: `${Date.now()}$`,
        nombre: nombre,
        numero: numero,
        direccion: direccion
    };
    contactos.push(objetoContacto);
};

//Se trae los elementos para ser guardados dentro del clone, para ser pasados al fragment y posterior
//pintarlas en el cardDatos donde se mostrarán en el sitio web
const mostrarContactos = () => {

    localStorage.setItem('contactos', JSON.stringify(contactos)); //localStorage solo guarda strings.

    cardDatos.textContent = "";
    const fragment = document.createDocumentFragment();

    contactos.forEach((item) => {
        const clone = templateForm.cloneNode(true);
        clone.querySelector('.pNombre').textContent = item.nombre;
        clone.querySelector('.pNumero').textContent = item.numero;
        clone.querySelector('.pDireccion').textContent = item.direccion;
        clone.querySelector('.material-icons').dataset.id = item.id; //Hacemos que el icono cuente con
        //un data-id el cual será el mismo que el id de nuestro objeto donde guardamos datos. (Dataset solo guarda String).
        fragment.appendChild(clone);
    });
    
    cardDatos.appendChild(fragment);
};



//Botón del form, "submit", creación de formdata segun input.
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    nameError.classList.add('d-none');
    phoneError.classList.add('d-none');
    adressError.classList.add('d-none');

    
    const data = new FormData(formulario);
    const [nombre,numero,direccion] = [...data.values()]; //Son los nombres de los input.
    
    // el trim nos devolverá true si el campo está vacío o solo contiene espacios en blanco.
    if(!regExpNombre.test(nombre)){ //según la expresiones regulares, se mostrará el respectivo error.
        nameError.classList.remove('d-none');
        return
    }

    if(!regExpCelular.test(numero)){
        phoneError.classList.remove('d-none');
        return
    }

    if(!regExpAdress.test(direccion)){
        adressError.classList.remove('d-none');
        return
    }
    //El return va, ya que, si no lo ponemos, saltará el mensaje de error, pero también se guardará el contacto.



    agregarContacto(nombre,numero,direccion);
    mostrarContactos();
});


//Botón eliminar
document.addEventListener('click',(e)=> {
    if(e.target.matches('.material-icons')){ //matches busca por una clase de todo nuestro html.
        contactos = contactos.filter(item => 
            item.id !== e.target.dataset.id); // Esto lo que hace, es que devolverá solo los elementos que 
            //cumplan con la condicion, por ende, al clickear en el boton, borrará,
            // ya que boton = dataset.id=item.id
        mostrarContactos();
    };
});


document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('contactos')){ //Usamos el metodo get para traer la misma variable del set.
        contactos = JSON.parse(localStorage.getItem('contactos')); //En el JSON anterior lo parseamos a 
        //String, aquí lo volvemos a dejar como array
        mostrarContactos(); //Esto nos mostrará los datos ya guardados del localStorage, sino,
        //se guardan en localStorage, pero no se muestran.
    };
});


