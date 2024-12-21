import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService:JwtService){

  }

  
  canActivate(context: ExecutionContext,): boolean | Promise<boolean>{
    console.log("estoy en el guard")
    console.log(process.env.JWT_SECRET); 
    const request = context.switchToHttp().getRequest();

   const bearerToken= request.headers.authorization;
   console.log(bearerToken)
   
   if (!bearerToken){
    return false
   }
   if (bearerToken.split(' ')[0] !=='Bearer'){
    return false
   }
   const token =bearerToken.split(' ')[1];
   try{
    const valor=this.jwtService.verify(token,{ secret: process.env.JWT_SECRET })
    request.datosUsuarios=valor
  
   }catch(error){
    console.error(error)
    return false
   }
   console.log("sigo en el guard")

    return true;
  }
}
