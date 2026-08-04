pipeline {
    agent any

    environment {
        IMAGE_NAME = 'rafaelms707/atividade5_pipelinedojenkins'
        CONTAINER_NAME = 'atividade5-frontend'
        CONTAINER_PORT = '8081'
    }

    stages {
        stage('Cleanup') {
            steps {
                echo 'Limpando arquivos anteriores e credenciais residuais...'
                sh '''
                    rm -rf node_modules dist
                    docker logout || true
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Instalando dependencias e compilando o frontend...'
                sh '''
                    CONTAINER_ID=$(docker create node:22-alpine sh -c "cd /app && npm install && npm run build")
                    docker cp . $CONTAINER_ID:/app
                    docker start -a $CONTAINER_ID
                    docker cp $CONTAINER_ID:/app/node_modules ./node_modules
                    docker cp $CONTAINER_ID:/app/dist ./dist
                    docker rm $CONTAINER_ID
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Verificando o artefato gerado pelo build...'
                sh 'test -f dist/index.html'
            }
        }

        stage('Run') {
            steps {
                echo 'Construindo e executando o container...'
                sh '''
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
                echo 'Verificando se o container esta rodando e respondendo...'
                sh '''
                    sleep 3
                    docker inspect -f '{{.State.Running}}' $CONTAINER_NAME
                    docker exec $CONTAINER_NAME wget -qO- http://localhost/ > /dev/null
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
            sh 'docker rm -f $CONTAINER_NAME || true'
        }
    }
}