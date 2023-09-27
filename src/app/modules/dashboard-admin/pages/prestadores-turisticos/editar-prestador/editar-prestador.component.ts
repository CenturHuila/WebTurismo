import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrestadorTuristico } from 'src/app/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-editar-prestador',
  templateUrl: './editar-prestador.component.html',
  styleUrls: ['./editar-prestador.component.css']
})
export class EditarPrestadorComponent  implements OnInit {

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

  // ? -> Propiedad Loading que nos va a determinar cuándo aparece el ícono de carga del html, se debe disparar la carga sólamente en caso de que el programa esté a la espera de una respuesta por parte de una promesa
  loading = false;

  //? -> Arreglo de URL de imágenes
  images: any[] = [];

  //? -> Imágen de Portada
  imgPortada: any;

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
      }
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
    })

    //? Mostrar imágenes

    //TODO: Crear la validación en caso de que no exístan valores a mostrar de las imágenes no se llenen las propiedades

    //Imágen de Portada
    this.imgPortada = this.prestador.pathImagePortada?.url;

    //Imágenes de Galería
    //Primero colocamos nuestro arreglo de objetos de tipo {path: , url: } a un arreglo que vamos iterar en el html para mostrarlas
    this.prestador.pathImages?.forEach(obj => {
      this.images.push(obj);
    })
    //console.log(this.images);
    //this.images.forEach(image => {console.log(image.url)});
  } //? -> Fin método Llenar Formulario

  //? -> Método para borrar las imágenes del Storage y del objeto que tengo actual (Además: Actualizar la BD por si sólo entro al componente Actualizar borro una imágen y luego me devuelvo)
  actualizarImagenes() {
    //TODO: Primero vamos a identificar qué imágenes debemos borrar según el click
    //TODO: Luego borramos las imágenes en el storage
    //TODO: Luego borramos las imágenes en el objeto que tenemos actualmente
    //TODO: Por último actualizamos los datos del objeto para que esté actualizado en caso de que sólo se quiera borrar imágenes y salir.
  }


  //? -> Método para editarPrestador
  editarPrestador() {

    //Creamos el objeto que queremos editar y que vamos a pasar a firebase, lo creamos con los valores que nos da el observable y lo que modificó el usuario en el formulario.
    this.prestadorTuristico = {
      id: this.prestador.id, // -> Nos lo da firebase
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
      pathImages: this.prestador.pathImages, // -> lo conseguimos en la inserción de imágenes
      meGusta: this.prestador.meGusta, // -> # de Me gustas en la App
      pathImagePortada: this.prestador.pathImagePortada
    }

    //Utilizamos el servicio con el método de actualizar los datos en Firestore
    this.prestadoresService.actualizarEmpleado(this.prestadorTuristico, this.files) //Manejamos la Promesa
    .then(() => {
      //Informamos
      alert('El prestador fue modificado con éxito');
      //Nos direcciona a la página del Listado
      this.router.navigate(['/dashboard-admin/pagina-inicio/list-prestadores-turisticos']);
    })
    .catch(error => console.log(error));

  } //? -> Fin método para Editar Prestador

  //? -> Método para Capturar los Archivos antes de enviar el Form - Se dispara el método con el Input
  uploadFiles($event: any) {
    //files es un arreglo de archivos que cargamos desde el html
    this.files = $event.target.files; //Apuntamos al input y luego los ficheros - los ficheros son un arreglo
    //console.log(this.files.length); // quiero saber el largo de mi arreglo
  } //? -> Fin Método cargar archivo


}
