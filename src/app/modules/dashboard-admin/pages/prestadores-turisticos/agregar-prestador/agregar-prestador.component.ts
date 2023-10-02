import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrestadorTuristico } from 'src/app/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-agregar-prestador',
  templateUrl: './agregar-prestador.component.html',
  styleUrls: ['./agregar-prestador.component.css']
})
export class AgregarPrestadorComponent implements OnInit {

  // ? -> La propiedad createPrestador no es un Objeto, es una Propiedad de Almacén de los datos HTML
  createPrestador: FormGroup; //Propiedad para almacenar los valores del Formulario y Gestionarlos.

  // ? -> Lo vamos a utilizar en el ngIf del span del aviso una vez enviado el Form
  submitted = false; //Para saber si se envió el form de manera correcta.

  // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
  prestadorTuristico: PrestadorTuristico;

  // ? -> Propiedad para almacenar los archivos antes de cargarlos a la BD
  files: any[] = []; //Presupongo que los archivos son un arreglo de tipo any, no estoy seguro

  //? -> Propiedad para almacenar la imágen de portada antes de cargarla a la BD
  portadaFile: any;

  // ? -> Propiedad Loading que nos va a determinar cuándo aparece el ícono de carga del html, se debe disparar la carga sólamente en caso de que el programa esté a la espera de una respuesta por parte de una promesa
  loading = false;

  //? Inyecciones de Dependencias
  constructor(
    private fb: FormBuilder, // Modulo para Formulario - Permite validar el formulario de manera sencilla.
    private prestadoresService: PrestadoresService, // Servicio con los métodos CRUD para Prestadores
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
  ) {
    //Aquí inicializamos propiedades.
    //Formulario - Se declaran las variables que lo conforman.
    this.createPrestador = this.fb.group({
      nombre: ['', Validators.required],
      rntRm: ['', Validators.required],
      descripcion: ['', Validators.required],
      servicios: ['', Validators.required],
      zona: ['', Validators.required],
      municipio: ['', Validators.required],
      direccion: ['', Validators.required],
      indicacionesAcceso: ['', Validators.required],
      googleMaps: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      whatsapp: ['', Validators.required],
      celular1: ['', Validators.required],
      celular2: ['', Validators.required],
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      pagWeb: ['', Validators.required],
      correo: ['', Validators.required],
      horarioAtencion: ['', Validators.required],
      alojamientoUrbano: ['', Validators.required],
      alojamientoRural: ['', Validators.required],
      restaurantes: ['', Validators.required],
      tiendasDeCafe: ['', Validators.required],
      antojosTipicos: ['', Validators.required],
      sitioNatural: ['', Validators.required],
      patrimonioCultural: ['', Validators.required],
      miradores: ['', Validators.required],
      parquesNaturales: ['', Validators.required],
      agenciasDeViaje: ['', Validators.required],
      centroRecreativo: ['', Validators.required],
      guiasDeTurismo: ['', Validators.required],
      aventura: ['', Validators.required],
      agroYEcoturismo: ['', Validators.required],
      planesORutas: ['', Validators.required],
      artesanias: ['', Validators.required],
      transportes: ['', Validators.required],
      eventos: ['', Validators.required]
    })

    //Inicializamos la propiedad PrestadorTurístico
    this.prestadorTuristico = {
      //id -> Nos lo da firebase
      name: '',
      rntRm: '',
      descripcion: '',
      servicios: '',
      zona: '',
      municipio: '',
      direccion: '',
      indicacionesAcceso: '',
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      whatsapp: 0,
      celular1: 0,
      celular2: 0,
      facebook: '',
      instagram: '',
      pagWeb: '',
      correo: '',
      horarioAtencion: '',
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
        path:'',
        url: ''
      },
      alojamientoUrbano: '',
      alojamientoRural: '',
      restaurantes: '',
      tiendasDeCafe: '',
      antojosTipicos: '',
      sitioNatural: '',
      patrimonioCultural: '',
      miradores: '',
      parquesNaturales: '',
      agenciasDeViaje: '',
      centroRecreativo: '',
      guiasDeTurismo: '',
      aventura: '',
      agroYEcoturismo: '',
      planesORutas: '',
      artesanias: '',
      transportes: '',
      eventos: ''
    }

  } //? -> Fin Constructor

  ngOnInit():void {

  }

  //? -> Método para agregar un Prestador en Firestore
  //Aquí se gestionan los datos que se digitan desde el html - Se ejecuta lo que queremos hacer inmediatamente enviemos el Form.
  agregarPrestador() {

    this.submitted = true; //Confirmamos que se envió el formulario.

    //Usamos una validación en caso de que el Formulario sea inválido. (Se ve en el status).
    //Es inválido cuando no se han llenado todos los campos
    if(this.createPrestador.invalid) {
      return; //Sale del método y no ejecuta nada más.
    }

    //? -> Cambiamos la variable a true para indicar que empieza el proceso lógico con los métodos una vez enviado el form y validandos los valores del form
    this.loading = true;

    //Ahora vamos a inicializar nuestra constante de tipo Object pre-definida en la Interfaz, en este caso PrestadorTuristico
    //El objeto lo vamos a enviar a Firebase para almacenar
    this.prestadorTuristico = {
      //id -> Nos lo da firebase
      name: this.createPrestador.value.nombre,
      rntRm: this.createPrestador.value.rntRm,
      descripcion: this.createPrestador.value.descripcion,
      servicios: this.createPrestador.value.servicios,
      zona: this.createPrestador.value.zona,
      municipio: this.createPrestador.value.municipio,
      direccion: this.createPrestador.value.direccion,
      indicacionesAcceso: this.createPrestador.value.indicacionesAcceso,
      googleMaps: this.createPrestador.value.googleMaps,
      latitud:this.createPrestador.value.latitud,
      longitud:this.createPrestador.value.longitud,
      whatsapp:this.createPrestador.value.whatsapp,
      celular1:this.createPrestador.value.celular1,
      celular2:this.createPrestador.value.celular2,
      facebook: this.createPrestador.value.facebook,
      instagram: this.createPrestador.value.instagram,
      pagWeb: this.createPrestador.value.pagWeb,
      correo: this.createPrestador.value.correo,
      horarioAtencion: this.createPrestador.value.horarioAtencion,
      pathImages: [], // -> lo conseguimos en la inserción de imágenes
      meGusta: 0, // -> # de Me gustas en la App
      pathImagePortada: { // -> lo conseguimos en la inserción de imágenes
        path:'',
        url: ''
      },
      alojamientoUrbano: this.createPrestador.value.alojamientoUrbano,
      alojamientoRural: this.createPrestador.value.alojamientoRural,
      restaurantes: this.createPrestador.value.restaurantes,
      tiendasDeCafe: this.createPrestador.value.tiendasDeCafe,
      antojosTipicos: this.createPrestador.value.antojosTipicos,
      sitioNatural: this.createPrestador.value.sitioNatural,
      patrimonioCultural: this.createPrestador.value.patrimonioCultural,
      miradores: this.createPrestador.value.miradores,
      parquesNaturales: this.createPrestador.value.parquesNaturales,
      agenciasDeViaje: this.createPrestador.value.agenciasDeViaje,
      centroRecreativo: this.createPrestador.value.centroRecreativo,
      guiasDeTurismo: this.createPrestador.value.guiasDeTurismo,
      aventura: this.createPrestador.value.aventura,
      agroYEcoturismo: this.createPrestador.value.agroYEcoturismo,
      planesORutas: this.createPrestador.value.planesORutas,
      artesanias: this.createPrestador.value.artesanias,
      transportes: this.createPrestador.value.transportes,
      eventos: this.createPrestador.value.eventos
    }

    console.log(this.prestadorTuristico); //Quiero ver lo que mi objeto guardó y se va a mandar a la BD

    //Servicio llamando al método para Agregar Prestador Turístico a Firestore con la galería de imágenes
    this.prestadoresService.agregarPrestador(this.prestadorTuristico, this.files, this.portadaFile) //DEBO ENVIAR LOS ARCHVOS (imágenes) TAMBIEN y el Proceso de carga de archivos se ejecuta en el servicio
    .then(() => {
      //Mensaje
      alert('El prestador fue registrado con éxito');
      //El loading pasa a false una vez obtenemos las respuesta a nuestra promesa del método.
      this.loading = false;
      //El router nos direcciona a otro componente
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-prestadores-turisticos']);
    })
    .catch(error => {
      console.log(error)
      console.log('Error en la respuesta a la inserción de Datos Firestore')
    })

  } //? -> Fin Método Agregar Prestador

  //? -> Método para Capturar los Archivos antes de enviar el Form - Se dispara el método con el Input
  uploadFiles($event: any) {
    //files es un arreglo de archivos que cargamos desde el html
    this.files = $event.target.files; //Apuntamos al input y luego los ficheros - los ficheros son un arreglo
    //console.log(this.files.length); // quiero saber el largo de mi arreglo
  } //? -> Fin Método cargar archivo

  //? -> Método para Cargar la imágen de portada o imágen principal
  uploadFilePortada($event: any) {
    this.portadaFile = $event.target.files[0];
    // console.log(this.portadaFile);
  }

} //? -> Fin clase
