import { Injectable } from '@nestjs/common';
import { Area } from 'src/models/Area';

@Injectable()
export class EquipoService {

      equipo:Area[];

      constructor(){
        this.equipo= [
          new Area("Diseño_UX_UI", "Amalia Luna", [
            "Amalia Luna",
            "Valeria Gutiérrez",
            "Macarena Campos",
            "Valentina Tabilo"
          ]),
          new Area("Front-End", "Cristian Levio", [
            "Cristian Levio",
            "Sebastián Rubilar",
            "Esteban Menares"
          ]),
          new Area("Back-End", "Christian Castillo", [
            "Christian Castillo",
            "Flor Granados",
            "Rodrigo Cabello",
            "Camilo Orellana"
          ]),
          new Area("Mobile", "María Elena Valencia", [
            "María Elena Valencia"
          ])
        ];
        

      }

      private ecommerce = {
        nombre: 'Plantopía',
        descripcion: 'Una tienda en línea para productos de plantas.',
        tipo: 'E-commerce B2C',
        objetivoGeneral:"Construir una tienda intuitiva, diseñada para optimizar el tiempo y las necesidades del usuario.",
        objetivosEspecificos: ['Ampliar el acceso a la compra de insumos para plantas',
                               'Facilitar la compra informada a través de búsquedas personalizadas.',
                               'Ofrecer servicios de suscripción de mantenimiento.', 'Expandir el catálogo'],
      };
    
        nombreEquipo:string="Green Roots"
        jefeEquipo:string="María Elena Valencia"
       

      getEquipo(){
        let areas:string[]=[];
        let integrantes:string[]=[];
        for (let index = 0; index < this.equipo.length; index++) {
               areas.push(this.equipo[index].nombreArea)
              for (let y = 0; y < this.equipo[index].miembros.length; y++) {
               integrantes.push(this.equipo[index].miembros[y])
                
              }
        }
        return  {
          nombreEquipo:this.nombreEquipo,
          liderEquipo:this.jefeEquipo,
          equipo:this.equipo.map(area => ({
            
            nombreArea: area.nombreArea,
            jefe: area.jefe,
            miembros: area.miembros
        }))
      }}


      getEcommerce(){
        return this.ecommerce;
      }

      getAreas(nombreArea?: string): Area[] {
        if (nombreArea) {
          return this.equipo.filter(area =>
            area.nombreArea.toLowerCase() === nombreArea.toLowerCase()
          );
        }
        return this.equipo;
      }
    }
