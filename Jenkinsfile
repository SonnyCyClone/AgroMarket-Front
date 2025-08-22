pipeline {
  agent any
  options { timestamps() }

  environment {
    RG        = 'az-asp-apps-javeriana'
    WEBAPP_FE = 'az-webapp-front-yaper'
    FE_ROOT   = '.'
    FE_ZIP    = 'frontend.zip'
  }

  stages {
    stage('Checkout (SCM)') {
      steps {
        checkout scm
        sh 'git rev-parse --abbrev-ref HEAD && git log -1 --oneline'
      }
    }

    stage('Build Angular') {
      steps {
        dir("${env.FE_ROOT}") {
          sh '''
            set -e
            node -v
            npm -v
            if [ -f package-lock.json ]; then
              npm ci --no-audit --no-fund || npm ci --legacy-peer-deps
            else
              npm install --no-audit --no-fund
            fi
            npx ng version || npx --yes @angular/cli@latest version
            npx ng build --configuration production
          '''
        }
      }
    }

    stage('Package dist + web.config') {
      steps {
        sh '''
          set -e
          rm -f "$FE_ZIP"
          DIST_ROOT="$FE_ROOT/dist"
          SUBDIR="$(find "$DIST_ROOT" -maxdepth 1 -mindepth 1 -type d | head -n 1)"
          if [ -z "$SUBDIR" ]; then
            echo "No se encontró carpeta en $DIST_ROOT"
            exit 1
          fi
          CONTENT="$SUBDIR/browser"
          [ -d "$CONTENT" ] || CONTENT="$SUBDIR"
          if [ ! -f "$FE_ROOT/web.config" ]; then
            echo "Falta web.config en la raíz"
            exit 1
          fi
          cp -f "$FE_ROOT/web.config" "$CONTENT/web.config"
          (cd "$CONTENT" && zip -r -9 "$WORKSPACE/$FE_ZIP" .)
        '''
      }
    }

    stage('Azure Login (solo main)') {
      when {
        allOf {
          expression { return env.BRANCH_NAME == 'main' }
          not { expression { return env.CHANGE_ID } }
        }
      }
      steps {
        withCredentials([
          azureServicePrincipal(
            credentialsId: 'acde3a54-84b0-4973-8ba8-4f184a24b8b9',
            subscriptionIdVariable: 'AZURE_SUBSCRIPTION_ID',
            clientIdVariable:       'AZURE_CLIENT_ID',
            clientSecretVariable:   'AZURE_CLIENT_SECRET',
            tenantIdVariable:       'AZURE_TENANT_ID'
          )
        ]) {
          sh '''
            set -e
            az login --service-principal -u "$AZURE_CLIENT_ID" -p "$AZURE_CLIENT_SECRET" --tenant "$AZURE_TENANT_ID" > /dev/null
            az account set --subscription "$AZURE_SUBSCRIPTION_ID"
            az account show
          '''
        }
      }
    }

    stage('Deploy to Azure (solo main)') {
      when {
        allOf {
          expression { return env.BRANCH_NAME == 'main' }
          not { expression { return env.CHANGE_ID } }
        }
      }
      steps {
        sh '''
          set -e
          az webapp deploy \
            --resource-group  "$RG" \
            --name            "$WEBAPP_FE" \
            --src-path        "$FE_ZIP" \
            --type            zip
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend.zip', onlyIfSuccessful: true
      sh '''
        if command -v az >/dev/null 2>&1; then
          az account show >/dev/null 2>&1 && az logout || true
        fi
      '''
    }
  }
}
