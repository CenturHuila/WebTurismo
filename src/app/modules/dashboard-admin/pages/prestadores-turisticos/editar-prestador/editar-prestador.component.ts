import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrestadorTuristico } from 'src/app/core/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';


@Component({
  selector: 'app-editar-prestador',
  templateUrl: './editar-prestador.component.html',
  styleUrls: ['./editar-prestador.component.css']
})
export class EditarPrestadorComponent  implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';

  //? Observable con el que vamos a recibir la información compartida desde el componente listar
  private data$: Observable<PrestadorTuristico>;

  //? Propiedad de tipo PrestadorTuristico para almacenar y manipular lo que trae el Observable
  prestador!: PrestadorTuristico;

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

  //? -> Arreglo de URL de imágenes
  images: any[] = [];

  //? -> Imágen de Portada
  imgPortada: any;

  //? -> Validación
  imgPortadaVal = true;

  //? -> Propiedad para controlar si se muestra un elemento en el *ngIf
  mostrarElemento: boolean = true;

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
      transporte: ['', Validators.required],
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
      pathImagePortada: {
        path: '',
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
      transporte: '',
      eventos: ''
    }

    //Inicializamos el Observable y nos suscribimos a él para obtener la información
    this.data$ = this.prestadoresService.sharingPrestador;

  } //? -> Fin Constructor

  ngOnInit():void {
    // this.data$.subscribe((valor) => {
    //   console.log('Valor emitido por BehaviorSubject:', valor);
    // })
    this.llenarFormulario(); // Disparamos el método que nos trae lo necesario para trabajar la actualización
  }

  //? -> Método para rellenar los campos del formulario con el objeto que tenemos y mostrar las imágenes que tiene el objeto asociadas
  llenarFormulario() {

    //Primero nos suscribimos a nuestro observable para obtener los datos del elemento que queremos actualizar
    this.data$.subscribe((prestador) => {
      //Pasamos los datos del Observable a nuestra propiedad nativa para mejor manipulación de datos
      this.prestador = prestador;
    })

    //Vamos a rellenar el formulario sólo con los datos que necesitan los campos
    this.createPrestador.setValue({
      nombre: this.prestador.name,
      rntRm: this.prestador.rntRm,
      descripcion: this.prestador.descripcion,
      servicios: this.prestador.servicios,
      zona: this.prestador.zona,
      municipio: this.prestador.municipio,
      direccion: this.prestador.direccion,
      indicacionesAcceso: this.prestador.indicacionesAcceso,
      googleMaps: this.prestador.googleMaps,
      latitud: this.prestador.latitud,
      longitud: this.prestador.longitud,
      whatsapp: this.prestador.whatsapp,
      celular1: this.prestador.celular1,
      celular2: this.prestador.celular2,
      facebook: this.prestador.facebook,
      instagram: this.prestador.instagram,
      pagWeb: this.prestador.pagWeb,
      correo: this.prestador.correo,
      horarioAtencion: this.prestador.horarioAtencion,
      alojamientoUrbano: this.prestador.alojamientoUrbano,
      alojamientoRural: this.prestador.alojamientoRural,
      restaurantes: this.prestador.restaurantes,
      tiendasDeCafe: this.prestador.tiendasDeCafe,
      antojosTipicos: this.prestador.antojosTipicos,
      sitioNatural: this.prestador.sitioNatural,
      patrimonioCultural: this.prestador.patrimonioCultural,
      miradores: this.prestador.miradores,
      parquesNaturales: this.prestador.parquesNaturales,
      agenciasDeViaje: this.prestador.agenciasDeViaje,
      centroRecreativo: this.prestador.centroRecreativo,
      guiasDeTurismo: this.prestador.guiasDeTurismo,
      aventura: this.prestador.aventura,
      agroYEcoturismo: this.prestador.agroYEcoturismo,
      planesORutas: this.prestador.planesORutas,
      artesanias: this.prestador.artesanias,
      transporte: this.prestador.transporte,
      eventos: this.prestador.eventos
    })

    //? Mostrar imágenes



    //Crear la validación en caso de que no exístan valores a mostrar de las imágenes no se llenen las propiedades

    //? Imágen de Portada
    //Pasamos el objeto que vamos a mostrar a una propiedad local
    this.imgPortada = this.prestador.pathImagePortada;
    //Hacemos una validación por propiedades del objeto
    if(this.imgPortada.path === '' && this.imgPortada.url === '') {
      this.imgPortadaVal = false;
    } else {
      this.imgPortadaVal = true;
    }

    //? Imágenes de Galería
    //Primero colocamos nuestro arreglo de objetos de tipo {path: , url: } a un arreglo que vamos iterar en el html para mostrarlas
    this.prestador.pathImages?.forEach(obj => {
      this.images.push(obj);
    })

  } //? -> Fin método Llenar Formulario

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  actualizarImagenPortada(imgPortada: any) {
    //Primero borramos en Storage (Servicio)
    this.prestadoresService.borrarImg(imgPortada);
    //Luego hacemos el borrado en nuestra propiedad this.prestador (En este componente)
    this.prestador.pathImagePortada = {path: '', url: ''};
    //Cambiamos el dato de la variable que valida la existéncia de imágen de portada
    this.imgPortadaVal = false;
    //Luego actulizamos los datos de Firestore (Con nuetro this.prestador, para que queden igual los datos de la BD y los datos del componente)
    this.prestadoresService.actualizarPrestador(this.prestador);
  }

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  //Primero vamos a identificar qué imágenes debemos borrar según el click, en el html (El objeto)
  actualizarImagenesGaleria(image: any, indice: any) {
    //Borramos la imágen seleccionada en el storage
    this.prestadoresService.borrarImg(image);
    //Luego borramos las imágenes en el arreglo de objetos que tenemos actualmente (En este componente)
    this.prestador.pathImages?.splice(indice, 1); //Pasamos la posición del elemento y la cantidad de elementos que quiero borrar
    //Luego borramos las imágenes en el arreglo que se está renderizando en el html (Importante para mostrar el cambio de las imágenes en tiempo real ya que this.prestador.pathImages y this.images son dos arreglo distintos)
    this.images.splice(indice, 1);
    //this.mostrarElemento = !this.mostrarElemento;
    //Luego actulizamos los datos de Firestore (Con nuetro this.prestador, para que queden igual los datos de la BD y los datos del componente)
    this.prestadoresService.actualizarPrestador(this.prestador);
  }

  //? -> Método para editarPrestador
  editarPrestador() {
    //Creamos el objeto que queremos editar y que vamos a pasar a firebase, lo creamos con los valores que nos da el observable y lo que modificó el usuario en el formulario.
    this.prestadorTuristico = {
      id: this.prestador.id, // -> No se modifica con el Form
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
      pathImages: this.prestador.pathImages, // -> No se modifica con el Form
      meGusta: this.prestador.meGusta, // -> No se modifica con el Form
      pathImagePortada: this.prestador.pathImagePortada, // -> No se modifica con el Form
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
      transporte: this.createPrestador.value.transporte,
      eventos: this.createPrestador.value.eventos
    }

    //Utilizamos el servicio con el método de actualizar los datos en Firestore
    this.prestadoresService.editarPrestador(this.prestadorTuristico, this.files, this.portadaFile) //Manejamos la Promesa
    .then(() => {
      //Informamos
      alert('El prestador fue modificado con éxito');
      //Nos direcciona a la página del Listado
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-prestadores-turisticos']);
    })
    .catch(error => console.log(error));

  } //? -> Fin método para Editar Prestador
  selectedImages: any[] = [];
  selectedImages2: any[] = [];
  //? -> Método para Capturar los Archivos antes de enviar el Form - Se dispara el método con el Input
  uploadFiles($event: any) {

    const files = $event.target.files as FileList;
    this.files = $event.target.files;
    // Convertir FileList a Array y obtener vistas previas
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  } //? -> Fin Método cargar archivo


  //? -> Método para Cargar la imágen de portada o imágen principal
  uploadFilePortada($event: any) {
    this.selectedImages2 = []; //Vaciamos el arreglo de imágenes
    const files = $event.target.files as FileList;
    this.portadaFile = $event.target.files[0];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImages2.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
    // console.log(this.portadaFile);
  }

}
