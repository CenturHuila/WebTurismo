import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Municipio } from 'src/app/core/common/place.interface';
import { MunicipiosService } from 'src/app/core/services/municipios.service';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado-municipio',
  templateUrl: './listado-municipio.component.html',
  styleUrls: ['./listado-municipio.component.css']
})
export class ListadoMunicipioComponent implements OnInit {

  private modalDataSubscription!: Subscription;
  private modalDataSubscription2!: Subscription;
  private modalDataSubscription3!: Subscription;


  modalsuichmuni!:boolean;
  warning!:boolean;

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closemodal();
    }
  }

  toID() {
    const List = document.getElementById("ListID");
    window.scrollTo({
      top: List!.offsetTop,
      behavior: "smooth" // Para un desplazamiento suave (con animación), o "auto" para un desplazamiento instantáneo.
    });
  }

  openmodalmuni() {
    this.modalService.setModalSuichMuni(true);
  }

  openmodalwarning(value: string) {
    this.modalService.setWarning(true);
    this.modalService.setValue(value);
  }

  closemodal() {
    this.modalService.setModalSuichMuni(false);//cierra el modal
    this.modalService.setWarning(false);
   }


  //?Página Dónde estamos, propiedad para la paginación
  page: number = 1;

  //? -> Propiedad para el Pipe en el filtro de texto
  filterPost: string = '';

  //? -> Propiedad para el Pipe en el filtro por botón de Servicios
  servicio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para el Pipe en el filtro por botón de Municipios
  zonaFilter: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para almacenar el arreglo de objetos que nos va a traer la BD al disparar el método getAtractivo, la utilizamos para Bandear los datos en el html de list y mostrar los datos
  municipios: Municipio[] = [];

  //? -> Inyecciones de dependencias
  constructor(
    private municipiosService: MunicipiosService, // Inyectamos el servicio
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
    private modalService: ModalServiceService
  ) {

  }

  ngOnInit() {

    this.modalDataSubscription =  this.modalService.modalsuichmuni$.subscribe((value) => {
      this.modalsuichmuni = value;
    });

    this.modalDataSubscription2 = this.modalService.warning$.subscribe((value) => {
      this.warning = value;
    });
    //Lo ejecutamos en el método OnInit para que dispare el método getAtractivo y me cargue los datos apenas se cargue el componente. Además de que disparamos el cold Observable para que se actualizen los datos a tiempo real.
    this.getAtractivo();
  }

  ngOnDestroy() {
    if (this.modalDataSubscription) {
      this.modalDataSubscription.unsubscribe();
    }
    if (this.modalDataSubscription2) {
      this.modalDataSubscription2.unsubscribe();
    }
    if (this.modalDataSubscription3) {
      this.modalDataSubscription3.unsubscribe();
    }
  }

  //? -> Método para obtener los elementos de la BD
  getAtractivo() {
    //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
    this.modalDataSubscription3 =   this.municipiosService.obtenerMunicipios().subscribe(data => {
      // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
      // console.log(data);
      this.municipios = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
    })
  }


  //? -> Método para eliminar un Prestador
  eliminarMunicipio(atractivo: any) {
    //Primero borramos los datos del Storage ya que necesitamos el path de la imágenes que tiene nuestro objeto guardado en Firestore
    // Hacer Validación de si exísten imágenes para borrar en cada caso
    this.municipiosService.borrarImagenesMunicipio(atractivo);

    //Aquí eliminamos los datos de Firestore
    this.municipiosService.borrarMunicipio(atractivo)
    .then(() => {
      alert('Atractivo Turistico Eliminado');
    })
    .catch(error => console.log(error));
  }

  //? -> Método para obtener objeto a actualizar y enviarlo por medio de Observables
  obtenerMunicipio(municipio: any) {
    //Utilizamos un BehaviorSubject para obtener el dato que queremos actualizar
    this.municipiosService.editMunicipioData = municipio;
    this.router.navigate(['/dashboard-admin/pagina-inicio/editar-municipio']);
  }

  // //? -> Método para filtrar por medio del botón
  // applyFilterServices(selectedCategory: any) {
  //   this.servicio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
  //   this.servicio = this.servicio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  // } //Fin Función applyFilterServices

  //? -> Método para filtrar por medio del botón
  applyFilterZona(selectedCategory: any) {
    this.zonaFilter = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.zonaFilter = this.zonaFilter.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

}
