pipeline {

    agent any

    environment {
        IMAGE_NAME = 'rafaelms707/atividade5_pipelinedojenkins'
        CONTAINER_NAME = 'atividade5-frontend'
        CONTAINER_PORT = '8081'
        PROJECT_DIR = 'ProjetoGranjaFront-end'
    }

    stages {

        stage('Cleanup') {
            steps {
                echo 'Limpando arquivos anteriores...'

                sh '''
                    rm -rf ${PROJECT_DIR}/node_modules
                    rm -rf ${PROJECT_DIR}/dist
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Instalando dependencias e compilando o frontend...'

                sh '''
                    docker run --rm \
                        -v "$PWD/${PROJECT_DIR}:/app" \
                        -w /app \
                        node:22-alpine \
                        sh -c "npm install && npm run build"
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Verificando o artefato gerado pelo build...'

                sh '''
                    docker run --rm \
                        -v "$PWD/${PROJECT_DIR}:/app" \
                        -w /app \
                        node:22-alpine \
                        sh -c "test -f dist/index.html"
                '''
            }
        }

        stage('Run') {
            steps {
                echo 'Construindo e executando o container...'

                sh '''
                    # O Dockerfile precisa estar na pasta do projeto ou na raiz onde aponta o contexto (.)
                    cd ${PROJECT_DIR}
                    docker build -t $IMAGE_NAME:latest .

                    docker rm -f $CONTAINER_NAME || true

                    docker run -d \
                        --name $CONTAINER_NAME \
                        -p $CONTAINER_PORT:80 \
                        $IMAGE_NAME:latest
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                echo 'Verificando se o frontend esta respondendo...'

                sh '''
                    sleep 5
                    curl --fail http://localhost:$CONTAINER_PORT
                '''
            }
        }

        stage('Deploy no DockerHub') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push $IMAGE_NAME:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Removendo container utilizado pela pipeline...'

            sh '''
                docker rm -f $CONTAINER_NAME || true
            '''
        }
    }
}