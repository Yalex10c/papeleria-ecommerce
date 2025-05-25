pipeline {
  agent any

  environment {
    NODE_VERSION = '16.x'  // O la versión que uses
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Yalex10c/papeleria-ecommerce.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          // Instalar Node.js con plugin NodeJS
          def nodeHome = tool name: 'NodeJS_16', type: 'NodeJS'
          env.PATH = "${nodeHome}/bin:${env.PATH}"
        }
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test' // O el comando para correr pruebas unitarias
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build' // Construir el proyecto React o backend
      }
    }

    stage('Deploy') {
      steps {
        echo 'Aquí puedes hacer deploy, por ejemplo copiar archivos, o hacer docker build y push'
        // Ejemplo: sh 'docker build -t usuario/app .'
        // sh 'docker push usuario/app'
        // o scripts para desplegar en servidor, k8s, etc.
      }
    }
  }

  post {
    always {
      echo 'Pipeline terminado'
    }
    success {
      echo '¡Build exitoso!'
    }
    failure {
      echo 'Build fallido :('
    }
  }
}
