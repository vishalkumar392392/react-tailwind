pipeline {
    agent {
        node {
            label 'Maven'
        }
    }

    /***********************
     * PARAMETERS (UI)
     ***********************/
    parameters {
        gitParameter(
            name: 'BRANCH',
            type: 'PT_BRANCH',
            defaultValue: 'main',
            branchFilter: 'origin/(.*)',
            description: 'Select Git branch'
        )

        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'uat', 'prod'],
            description: 'Deployment environment'
        )

        string(
            name: 'IMAGE_NAME',
            defaultValue: 'tailwind-shoes',
            description: 'Docker image name'
        )

        string(
            name: 'REPLICAS',
            defaultValue: '1',
            description: 'Number of pod replicas'
        )

        string(
            name: 'REQUEST_CPU',
            defaultValue: '100m',
            description: 'CPU request'
        )

        string(
            name: 'REQUEST_MEMORY',
            defaultValue: '128Mi',
            description: 'Memory request'
        )

        string(
            name: 'LIMIT_CPU',
            defaultValue: '250m',
            description: 'CPU limit'
        )

        string(
            name: 'LIMIT_MEMORY',
            defaultValue: '256Mi',
            description: 'Memory limit'
        )
    }

    /***********************
     * ENVIRONMENT VARS
     ***********************/
    environment {
        PATH = "/opt/node/bin:$PATH"

        AWS_ACCOUNT_ID = "735235878184"
        AWS_REGION     = "us-east-2"

        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${params.IMAGE_NAME}:${IMAGE_TAG}"

        NAMESPACE = "${params.ENVIRONMENT}"
        VITE_MODE = "${params.ENVIRONMENT}"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm ci --no-audit --no-fund'
            }
        }

        stage('Lint & Build') {
            steps {
                sh 'npm run lint'
                sh 'npm run build'
            }
        }

        stage('Code Quality - SonarQube') {
            environment {
                scannerHome = tool 'eventcart-sonar-scanner'
            }
            steps {
                withSonarQubeEnv(
                    installationName: 'sonarqube-server-local',
                    credentialsId: 'sonarqubeLocalhost'
                ) {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                sh """
                  aws ecr get-login-password --region ${AWS_REGION} \
                  | docker login --username AWS --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                  docker build -t ${IMAGE_URI} .
                  docker push ${IMAGE_URI}
                  docker rmi ${IMAGE_URI} || true
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh """
                  aws eks update-kubeconfig \
                    --region ${AWS_REGION} \
                    --name eventcart-eks-01

                  export IMAGE_URI=${IMAGE_URI}
                  export NAMESPACE=${NAMESPACE}
                  export REPLICAS=${params.REPLICAS}
                  export VITE_MODE=${VITE_MODE}
                  export REQUEST_CPU=${params.REQUEST_CPU}
                  export REQUEST_MEMORY=${params.REQUEST_MEMORY}
                  export LIMIT_CPU=${params.LIMIT_CPU}
                  export LIMIT_MEMORY=${params.LIMIT_MEMORY}
                  export APP_NAME=${params.IMAGE_NAME}

                  # 1. Ensure namespace exists
                  kubectl get ns ${NAMESPACE} || kubectl create ns ${NAMESPACE}

                  # 2. Apply manifests (envsubst injects env-specific values)
                  envsubst < k8s/configmap.yaml   | kubectl apply -n ${NAMESPACE} -f -
                  envsubst < k8s/deployment.yaml  | kubectl apply -n ${NAMESPACE} -f -
                  envsubst < k8s/service.yaml    | kubectl apply -n ${NAMESPACE} -f -
                  envsubst < k8s/hpa.yaml        | kubectl apply -n ${NAMESPACE} -f -
                  envsubst < k8s/ingress.yaml    | kubectl apply -n ${NAMESPACE} -f -

                  # 3. Wait for rollout to complete — fail the build if pods don't become healthy
                  kubectl rollout status deployment/${params.IMAGE_NAME} \
                    -n ${NAMESPACE} --timeout=5m
                """
            }
        }

        stage('Post-Deploy Smoke Test') {
            steps {
                sh """
                  # Spin up an ephemeral curl pod and hit the in-cluster Service.
                  # `curl -fsS` exits non-zero on any non-2xx, which fails this shell step.
                  kubectl run smoke-${BUILD_NUMBER} \
                    --rm -i --restart=Never --quiet \
                    --image=curlimages/curl:latest \
                    -n ${NAMESPACE} \
                    -- curl -fsS -o /dev/null \
                       http://${params.IMAGE_NAME}.${NAMESPACE}.svc.cluster.local/healthz
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful to ${params.ENVIRONMENT}"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
