pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'tuusuario/papeleria-ecommerce'
    CONTAINER_NAME = 'papeleria-ecommerce'
    AZURE_APP_NAME = 'papeleria-ecommerce'
    AZURE_RESOURCE_GROUP = 'papeleria-group'
    AZURE_REGION = 'eastus'
  }

  stages {
    stage('Clonar proyecto') {
      steps {
        git url: 'https://github.com/Yalex10c/papeleria-ecommerce.git', branch: 'main'
      }
    }

    stage('Instalar dependencias') {
      steps {
        script {
          def nodeHome = tool name: 'NodeJS_16', type: 'NodeJS'
          env.PATH = "${nodeHome}/bin:${env.PATH}"
        }
        sh 'npm install'
      }
    }

    stage('Build del proyecto') {
      steps {
        sh 'npm run build || echo "No hay build para backend"'
      }
    }

    stage('Build de imagen Docker') {
      steps {
        script {
          docker.build(DOCKER_IMAGE)
        }
      }
    }

    stage('Push a Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-cred') {
              docker.image(DOCKER_IMAGE).push()
            }
          }
        }
      }
    }

    stage('Deploy en Azure') {
      steps {
        withCredentials([string(credentialsId: 'azure-cli-auth', variable: 'AZURE_CREDENTIALS')]) {
          sh '''
            echo "$AZURE_CREDENTIALS" > azureAuth.json
            az login --service-principal --username $(jq -r .clientId azureAuth.json) --password $(jq -r .clientSecret azureAuth.json) --tenant $(jq -r .tenantId azureAuth.json)

            az webapp config container set \
              --name $AZURE_APP_NAME \
              --resource-group $AZURE_RESOURCE_GROUP \
              --docker-custom-image-name $DOCKER_IMAGE \
              --docker-registry-server-url https://index.docker.io

            az webapp config appsettings set \
              --resource-group $AZURE_RESOURCE_GROUP \
              --name $AZURE_APP_NAME \
              --settings WEBSITES_PORT=3000
          '''
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finalizado'
    }
    success {
      echo '¡Despliegue exitoso en Azure App Service!'
    }
    failure {
      echo 'Error en el pipeline'
    }
  }
}
