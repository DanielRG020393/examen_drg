import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  @ViewChild('sidenav', { static: true }) public el: any;
  redireccionar: any;

  @HostListener('swiperight', ['$event']) public swipePrev(event: any) {
    this.el.show();
  }

  forma!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router:Router,
  ){
    this.crearFormulario();
    this.cargarDataFormulario();
  }

  ngOnInit(): void {
    // Verificar si ya hay un usuario autenticado en localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.router.navigateByUrl(user.home);
    }
  }

  ngAfterViewInit() {
    // Cargar último usuario desde localStorage si existe
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.forma.reset({
        correo: user.usu_login
      });
    }
  }

  get correoNoValido(){
    return this.forma.get('correo')?.invalid && this.forma.get('correo')?.touched
  }
  get passwordNoValido(){
    return this.forma.get('password')?.invalid && this.forma.get('password')?.touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      correo:   ['', [Validators.required] ],
      password:   ['', [Validators.required] ]
    });
  }

  cargarDataFormulario(){
    this.forma.reset({
      correo: "",
      password: ""
    });
  }

  resaltar(){
    return Object.values( this.forma.controls ).forEach( control => {
      if( control instanceof FormGroup){
        Object.values( control.controls ).forEach( control => control.markAsTouched() );
      }else{
        control.markAsTouched();
      }
    });
  }

  compro(){
    if(this.forma.invalid){
     return this.resaltar();
    }else{
      const dat = {
        "correo": this.forma.get('correo')?.value || '',
        "password": this.forma.get('password')?.value || '',
        "token": localStorage.getItem('authToken') || ''
      };
      this.auth.login(dat).subscribe(
        res => {
        if(res){
          this.guardarToken( res );
        }else{
          alert('Usuario o contraseña incorrectos.');
          this.forma.reset();
          return this.resaltar();
        }
        },
        err =>{
          console.log(err);
          alert('Error en el servidor. Intente nuevamente.');
          this.forma.reset();
          return this.resaltar();
        }
      );
    }
  }

  private guardarToken( datos:any ){
    // Ya se guardó en localStorage en el servicio, solo redirigir
    this.router.navigateByUrl(datos['home']);
  }

  hashedPassword: boolean = true;
  togglePassword() {
    this.hashedPassword = !this.hashedPassword;
  }

}
