# TaskFlow — To-Do List App

Aplicación móvil híbrida desarrollada con **Ionic 7** y **Angular 17**, que permite gestionar tareas con categorías, integración con **Firebase Firestore** y control de funcionalidades mediante **Firebase Remote Config**.

---

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución en Navegador](#ejecución-en-navegador)
- [Compilación para Android](#compilación-para-android)
- [Compilación para iOS](#compilación-para-ios)
- [Configuración de Firebase](#configuración-de-firebase)
- [Feature Flag con Remote Config](#feature-flag-con-remote-config)
- [Funcionalidades](#funcionalidades)
- [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Preguntas Técnicas](#preguntas-técnicas)

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

| Herramienta | Versión recomendada |
|---|---|
| Node.js | 20.x LTS |
| npm | 9.x o superior |
| Ionic CLI | 7.x |
| Angular CLI | 17.x |
| Cordova | Última versión |
| Android Studio | Latest |
| JDK | 17 |
| Xcode (solo macOS) | 15+ |

### Instalar herramientas globales

```bash
npm install -g @ionic/cli@7
npm install -g cordova
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/antony-mendoza-proyect01/App_Accenture_Prueba.git
cd taskflow-todo-app

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Verificar versiones
ng version     # Angular CLI: 17.x
ionic info     # Ionic Framework: @ionic/angular 7.x
```

---

## Ejecución en Navegador

```bash
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`.

---

## Compilación para Android

### Requisitos adicionales

- **Android Studio** instalado con SDK Android 33+
- Variable de entorno `ANDROID_HOME` configurada:

```bash
# En Windows (variables de entorno del sistema)
ANDROID_HOME = C:\Users\<usuario>\AppData\Local\Android\Sdk

# En Mac/Linux (~/.bashrc o ~/.zshrc)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Pasos para generar el APK

```bash
# 1. Agregar plataforma Android (solo la primera vez)
ionic cordova platform add android

# 2. Compilar APK de debug
ionic cordova build android

# 3. Compilar APK de release (producción)
ionic cordova build android --prod --release
```

### Ubicación del APK generado

```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar en dispositivo físico

1. Activar **Opciones de desarrollador** en el celular
2. Habilitar **Depuración USB**
3. Conectar el dispositivo y ejecutar:

```bash
ionic cordova run android --device
```

---

## Compilación para iOS

> **Nota:** La compilación para iOS requiere una Mac con Xcode instalado y una cuenta de desarrollador de Apple.

### Requisitos adicionales

- macOS con Xcode 15+
- Cuenta de Apple Developer
- CocoaPods instalado: `sudo gem install cocoapods`

### Pasos para generar el IPA

```bash
# 1. Agregar plataforma iOS (solo la primera vez)
ionic cordova platform add ios

# 2. Compilar para iOS
ionic cordova build ios

# 3. Abrir en Xcode para firmar y exportar
open platforms/ios/TaskFlow.xcworkspace
```

Desde Xcode:
1. Selecciona tu equipo de desarrollo en **Signing & Capabilities**
2. Ve a **Product → Archive**
3. En el Organizer, selecciona **Distribute App** para exportar el IPA

---

## Configuración de Firebase

### Pasos para configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Agregar una app web al proyecto
3. Copiar la configuración y pegarla en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

4. En Firebase Console, habilitar **Firestore Database** en modo de prueba
5. Habilitar **Remote Config**

---

## Feature Flag con Remote Config

La aplicación usa Remote Config para controlar la visibilidad de la sección de **Categorías** mediante el flag `show_categories`.

### Configurar el flag en Firebase Console

1. Ir a **Remote Config** en Firebase Console
2. Crear un nuevo parámetro:
   - **Nombre:** `show_categories`
   - **Tipo:** Boolean
   - **Valor por defecto:** `true`
3. Publicar los cambios

### Comportamiento del flag

| Valor de `show_categories` | Comportamiento |
|---|---|
| `true` | Se muestra la sección de categorías (crear, editar, eliminar) |
| `false` | La sección de categorías queda oculta; las tareas se crean sin categoría |

### Cómo funciona en el código

```typescript
// remoteconfig.service.ts
async init() {
  this.remoteConfig = getRemoteConfig(this.app);
  this.remoteConfig.defaultConfig = { show_categories: true };
  await fetchAndActivate(this.remoteConfig);
}

get showCategories(): boolean {
  return getValue(this.remoteConfig, 'show_categories').asBoolean();
}
```

```html
<!-- home.page.html -->
@if (showCategories) {
  <ion-card><!-- Sección de categorías --></ion-card>
}
```

---

## Funcionalidades

- Crear, completar y eliminar tareas
- Crear, editar y eliminar categorías
- Asignar una categoría a cada tarea
- Filtrar tareas por categoría
- Persistencia en tiempo real con Firebase Firestore
- Control de funcionalidades con Firebase Remote Config
- Diseño responsivo para pantallas pequeñas y medianas

---

## Optimizaciones de Rendimiento

| Técnica | Descripción |
|---|---|
| `ChangeDetectionStrategy.OnPush` | Angular solo re-renderiza cuando cambian las referencias, no en cada evento |
| `trackBy` en listas | Evita recrear elementos del DOM innecesariamente al actualizar listas |
| `takeUntil(destroy$)` | Cancela suscripciones al destruir el componente, previniendo memory leaks |
| Lazy loading de rutas | Las páginas se cargan solo cuando se navega a ellas |
| Imports individuales de Ionic | Se importan solo los componentes usados en lugar de `IonicModule` completo |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── models/
│   │   ├── task.ts
│   │   └── category.ts
│   ├── page/
│   │   └── home/
│   │       ├── home.page.ts
│   │       ├── home.page.html
│   │       └── home.page.scss
│   ├── service/
│   │   ├── task.service.ts
│   │   ├── category.service.ts
│   │   └── remoteconfig.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── main.ts
```

---

## Preguntas Técnicas

### ¿Cuáles fueron los principales desafíos?

**1. Incompatibilidad de versiones**
El proyecto se generó con Angular 20 por defecto, lo que requirió ajustar manualmente el `package.json` para forzar Angular 17 e Ionic 7. Se usó `--legacy-peer-deps` en toda la instalación para resolver conflictos de dependencias entre `zone.js`, `typescript` y los paquetes de Angular.

**2. Modo standalone vs módulos**
Ionic 7 con Angular 17 en modo standalone requiere importar cada componente individualmente desde `@ionic/angular/standalone` en lugar de usar `IonicModule`. Mezclar ambos enfoques causó el error `NG0300: Multiple components match node`, que se resolvió eliminando `IonicModule` y declarando explícitamente cada componente de Ionic en el array `imports` del decorador.

**3. Firebase Remote Config con inject()**
Integrar Remote Config usando `inject(RemoteConfig)` directamente causó errores en tiempo de ejecución. La solución fue inyectar `FirebaseApp` y obtener la instancia de Remote Config mediante `getRemoteConfig(app)`, que es el patrón correcto para esta versión de `@angular/fire`.

**4. Configuración de Córdova con Angular 17**
El builder `@ionic/cordova-builders` no se registra automáticamente al usar Angular 17 en modo standalone. Fue necesario instalarlo manualmente y agregar los targets `ionic-cordova-build` e `ionic-cordova-serve` directamente en `angular.json`.

---

### ¿Qué técnicas de optimización aplicaste y por qué?

**1. Lazy loading de rutas**
Las páginas se cargan solo cuando el usuario las visita, reduciendo el bundle inicial que debe descargarse al abrir la app:
```typescript
{
  path: 'home',
  loadComponent: () => import('./page/home/home.page').then(m => m.HomePage)
}
```
Esto es especialmente importante en dispositivos móviles con conexiones lentas.

**2. `ChangeDetectionStrategy.OnPush`**
Angular solo re-renderiza el componente cuando cambian las referencias de los inputs, no en cada evento del DOM. Con listas grandes de tareas esto reduce drásticamente el trabajo del hilo principal.

**3. `trackBy` en listas**
Las funciones `trackByTaskId` y `trackByCategoryId` permiten que Angular identifique cada elemento por su `id` único. Al actualizar la lista, solo se recrean los nodos del DOM que realmente cambiaron, en lugar de destruir y recrear toda la lista.

**4. `takeUntil(destroy$)` para evitar memory leaks**
Los `onSnapshot` de Firestore son streams que permanecen activos indefinidamente. Al implementar `takeUntil(destroy$)` con un `Subject`, todas las suscripciones se cancelan automáticamente cuando el componente se destruye, liberando memoria.

**5. Imports individuales de Ionic**
En lugar de importar `IonicModule` completo, se importan únicamente los componentes utilizados (`IonCard`, `IonButton`, `IonList`, etc.), lo que reduce el tamaño del bundle final del APK al eliminar código no utilizado.

**6. `BehaviorSubject` como estado reactivo**
El estado de tareas y categorías se gestiona con `BehaviorSubject`, evitando consultas repetidas a Firestore. Los componentes se suscriben al observable y reciben actualizaciones en tiempo real sin hacer nuevas peticiones.

---

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

**1. Separación de responsabilidades**
Se crearon servicios independientes para cada dominio: `TaskService`, `CategoryService` y `RemoteconfigService`. Cada servicio encapsula su propia lógica de Firestore y expone observables, manteniendo el componente enfocado únicamente en la presentación.

**2. Formularios reactivos con validación centralizada**
Se usó `ReactiveFormsModule` con `FormGroup` y `Validators.required` en lugar de template-driven forms. Esto permite:
- Validación centralizada y predecible
- Fácil acceso al estado del formulario (`invalid`, `dirty`, `touched`)
- Reset controlado con valores por defecto tras cada operación

**3. Tipado estricto con interfaces TypeScript**
Se definieron interfaces `Task` y `Category` con tipos explícitos para todas las propiedades, lo que detecta errores en tiempo de compilación y hace el código autodocumentado.

**4. Ciclo de vida con `OnInit` y `OnDestroy`**
Se implementaron correctamente los hooks de ciclo de vida para inicializar datos en `ngOnInit` y limpiar recursos en `ngOnDestroy`, siguiendo las buenas prácticas de Angular.

**5. Feature flags con Remote Config**
La visibilidad de funcionalidades se controla desde Firebase sin necesidad de publicar una nueva versión del APK, permitiendo activar o desactivar características de forma remota y segura.
