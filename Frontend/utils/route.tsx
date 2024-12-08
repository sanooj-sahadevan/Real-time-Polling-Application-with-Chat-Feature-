
// User Routes
const protectedUserRoutes = new Set([
    "/profilee", "/auditoriumInfo", "/auditoriumList", "/profile",'/home'
   , 
  ]);
  
  export function isProtectedUserRoute(pathname: string): boolean {
    return protectedUserRoutes.has(pathname);
  }
  
  export function toBeRedirectedRoutes(pathname: string): boolean {
    const changeToHomeRoutes = new Set(["/signup", "/signup"]);
    return changeToHomeRoutes.has(pathname);
  }
  
  
  
  