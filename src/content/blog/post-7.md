---
title: 'Kubernetes: Guía Completa de Orquestación de Contenedores para DevOps'
excerpt: Domina Kubernetes desde cero hasta producción. Aprende pods, services, deployments, ingress, helm charts y mejores prácticas de seguridad para gestionar clusters de contenedores a escala empresarial.
publishDate: 'July 24 2025'
tags:
  - Kubernetes
  - Orquestación
  - Contenedores
  - DevOps
  - Cloud-Native
  - Microservicios
  - K8s
  - Helm
  - Ingress
  - Docker
seo:
  image:
    src: '/post-7.jpg'
    alt: Dashboard de Kubernetes mostrando pods y servicios
---

![Orquestación de contenedores con Kubernetes](/post-7.jpg)

**Kubernetes** es la plataforma de orquestación de contenedores más poderosa y ampliamente adoptada en el ecosistema DevOps moderno. Como **"el sistema operativo de la nube"**, Kubernetes automatiza el despliegue, escalado y gestión de aplicaciones containerizadas, permitiendo a los equipos de desarrollo entregar software de manera más rápida, confiable y escalable.

En esta guía completa, aprenderás desde los conceptos fundamentales hasta técnicas avanzadas de producción, incluyendo configuraciones de seguridad, monitoreo y mejores prácticas utilizadas por las empresas más exitosas del mundo.

## ¿Por qué Kubernetes es Fundamental en DevOps?

### Ventajas Clave de Kubernetes:

- **🚀 Escalabilidad Automática**: Auto-scaling horizontal y vertical basado en métricas
- **🛡️ Alta Disponibilidad**: Self-healing, rolling updates y disaster recovery
- **🔄 Gestión Declarativa**: Infrastructure as Code para configuraciones reproducibles
- **🌐 Portabilidad Multi-Cloud**: Ejecuta en AWS, Azure, GCP o on-premises
- **📊 Observabilidad Nativa**: Métricas, logs y tracing integrados
- **🔒 Seguridad Avanzada**: RBAC, network policies y secrets management

### Casos de Uso Empresariales:

- **Aplicaciones Microservicios** con alta disponibilidad
- **CI/CD Pipelines** automatizados y escalables  
- **Modernización de aplicaciones** legacy
- **Plataformas multi-tenant** y SaaS
- **Data Processing** y machine learning workloads
- **Edge Computing** y IoT deployments

## 🏗️ Arquitectura de Kubernetes

### Componentes del Control Plane

```bash
┌─────────────────────────────────────────────────────────────┐
│                    KUBERNETES CONTROL PLANE                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   etcd      │  │ API Server  │  │   Scheduler         │  │
│  │ (Database)  │  │ (Gateway)   │  │ (Pod Placement)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │          Controller Manager                             │  │
│  │    (Deployments, ReplicaSets, Services, etc.)          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       WORKER NODES                         │
├─────────────────────────────────────────────────────────────┤
│  Node 1           │  Node 2           │  Node 3             │
│  ┌─────────────┐   │  ┌─────────────┐   │  ┌─────────────┐   │
│  │   kubelet   │   │  │   kubelet   │   │  │   kubelet   │   │
│  │ kube-proxy  │   │  │ kube-proxy  │   │  │ kube-proxy  │   │
│  │ Container   │   │  │ Container   │   │  │ Container   │   │
│  │ Runtime     │   │  │ Runtime     │   │  │ Runtime     │   │
│  └─────────────┘   │  └─────────────┘   │  └─────────────┘   │
│       │ Pods      │       │ Pods      │       │ Pods      │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Instalación y Configuración

### Opción 1: Minikube (Desarrollo Local)

```bash
# Instalar Minikube en Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Iniciar cluster local
minikube start --driver=docker --cpus=4 --memory=8g

# Verificar estado del cluster
minikube status
kubectl cluster-info

# Habilitar addons útiles
minikube addons enable dashboard
minikube addons enable metrics-server
minikube addons enable ingress
```

### Opción 2: kubeadm (Cluster de Producción)

```bash
# Preparar nodos (en todos los nodos)
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar kubeadm, kubelet y kubectl
sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg \
  https://packages.cloud.google.com/apt/doc/apt-key.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] \
  https://apt.kubernetes.io/ kubernetes-xenial main" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Inicializar cluster (solo en master node)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Configurar kubectl para usuario actual
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Instalar network plugin (Flannel)
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

### Instalación de kubectl

```bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verificar instalación
kubectl version --client
kubectl cluster-info

# Configurar autocompletado
echo 'source <(kubectl completion bash)' >>~/.bashrc
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

## 🎯 Conceptos Fundamentales

### Pods: La Unidad Básica

```yaml
# pod-example.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
    tier: frontend
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    env:
    - name: ENV
      value: "production"
    volumeMounts:
    - name: config-volume
      mountPath: /etc/nginx/conf.d
  volumes:
  - name: config-volume
    configMap:
      name: nginx-config
  restartPolicy: Always
```

### Deployments: Gestión de Aplicaciones

```yaml
# deployment-example.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 20
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Services: Networking y Descubrimiento

```yaml
# service-examples.yaml
---
# ClusterIP Service (interno)
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP

---
# LoadBalancer Service (externo)
apiVersion: v1
kind: Service
metadata:
  name: nginx-loadbalancer
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer

---
# NodePort Service (acceso por puerto de nodo)
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort
```

## 🛠️ Comandos Esenciales de kubectl

### Gestión de Recursos

```bash
# Aplicar configuraciones
kubectl apply -f deployment.yaml
kubectl apply -f https://raw.githubusercontent.com/ejemplo/config.yaml
kubectl apply -k ./directorio-kustomize/

# Obtener información
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get nodes -o wide

# Describir recursos detalladamente
kubectl describe pod nginx-pod
kubectl describe deployment nginx-deployment
kubectl describe service nginx-service

# Ver logs
kubectl logs nginx-pod
kubectl logs -f deployment/nginx-deployment
kubectl logs --previous nginx-pod

# Ejecutar comandos en contenedores
kubectl exec -it nginx-pod -- /bin/bash
kubectl exec nginx-pod -- ls /etc/nginx/

# Port forwarding para debugging
kubectl port-forward pod/nginx-pod 8080:80
kubectl port-forward service/nginx-service 8080:80
```

### Debugging y Troubleshooting

```bash
# Ver eventos del cluster
kubectl get events --sort-by=.metadata.creationTimestamp

# Verificar recursos del nodo
kubectl top nodes
kubectl top pods

# Debugging de networking
kubectl exec -it nginx-pod -- nslookup kubernetes.default
kubectl exec -it nginx-pod -- wget -qO- http://nginx-service

# Obtener configuración en YAML
kubectl get deployment nginx-deployment -o yaml
kubectl get pod nginx-pod -o json

# Editar recursos en vivo (no recomendado para producción)
kubectl edit deployment nginx-deployment
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":5}}'
```

## 🔒 ConfigMaps y Secrets

### ConfigMaps para Configuración

```yaml
# configmap-example.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://db:5432/myapp"
  debug_mode: "false"
  max_connections: "100"
  config.properties: |
    server.port=8080
    server.host=0.0.0.0
    logging.level=INFO
  nginx.conf: |
    upstream backend {
        server backend-service:8080;
    }
    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
```

### Secrets para Datos Sensibles

```bash
# Crear secrets desde línea de comandos
kubectl create secret generic app-secrets \
  --from-literal=database-password='supersecret123' \
  --from-literal=api-key='abc123xyz'

# Crear secret desde archivos
kubectl create secret generic ssl-certs \
  --from-file=tls.crt=path/to/cert.crt \
  --from-file=tls.key=path/to/cert.key

# Secret para registry privado
kubectl create secret docker-registry regcred \
  --docker-server=your-registry.com \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email@example.com
```

```yaml
# secret-example.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-password: c3VwZXJzZWNyZXQxMjM=  # base64 encoded
  api-key: YWJjMTIzeHl6  # base64 encoded
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        env:
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-password
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_url
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: app-config
      - name: secret-volume
        secret:
          secretName: app-secrets
```

## 🌐 Ingress y Networking

### Ingress Controller Setup

```bash
# Instalar NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Verificar instalación
kubectl get pods -n ingress-nginx
kubectl get services -n ingress-nginx
```

### Configuración de Ingress

```yaml
# ingress-example.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.example.com
    - api.example.com
    secretName: app-tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 3000
```

### Network Policies (Seguridad de Red)

```yaml
# network-policy-example.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

## 📊 Persistent Volumes y Storage

### Persistent Volume y Claims

```yaml
# storage-example.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /data/mysql
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast-ssd
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

## ⚡ Horizontal Pod Autoscaler (HPA)

```yaml
# hpa-example.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 60
      selectPolicy: Max
```

## 🔐 RBAC y Seguridad

### Role-Based Access Control

```yaml
# rbac-example.yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
  namespace: production
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: app-service-account
  namespace: production
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-reader
rules:
- apiGroups: [""]
  resources: ["nodes", "namespaces"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-reader-binding
subjects:
- kind: ServiceAccount
  name: app-service-account
  namespace: production
roleRef:
  kind: ClusterRole
  name: cluster-reader
  apiGroup: rbac.authorization.k8s.io
```

### Pod Security Standards

```yaml
# pod-security-example.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: secure-namespace
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  namespace: secure-namespace
spec:
  replicas: 2
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      serviceAccountName: app-service-account
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 3000
        fsGroup: 2000
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        image: nginx:1.21
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
        - name: cache-volume
          mountPath: /var/cache/nginx
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
      volumes:
      - name: tmp-volume
        emptyDir: {}
      - name: cache-volume
        emptyDir: {}
```

## 🎯 Helm: Package Manager para Kubernetes

### Instalación de Helm

```bash
# Instalar Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verificar instalación
helm version

# Agregar repositorios populares
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### Crear un Helm Chart

```bash
# Crear nuevo chart
helm create myapp

# Estructura del chart
myapp/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl
└── charts/
```

### Chart.yaml

```yaml
# Chart.yaml
apiVersion: v2
name: myapp
description: A Helm chart for MyApp
version: 0.1.0
appVersion: "1.0.0"
keywords:
  - web
  - application
home: https://myapp.example.com
maintainers:
  - name: Harol Reina
    email: harol@example.com
dependencies:
  - name: postgresql
    version: 12.x.x
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
```

### values.yaml

```yaml
# values.yaml
replicaCount: 3

image:
  repository: myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - myapp.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

postgresql:
  enabled: true
  auth:
    postgresPassword: "supersecret"
    database: "myapp"
```

### Desplegar con Helm

```bash
# Instalar chart
helm install myapp ./myapp -f values-production.yaml

# Actualizar release
helm upgrade myapp ./myapp -f values-production.yaml

# Ver releases
helm list

# Ver historial
helm history myapp

# Rollback
helm rollback myapp 1

# Desinstalar
helm uninstall myapp
```

## 📊 Monitoreo y Observabilidad

### Deploying Prometheus Stack

```bash
# Instalar Prometheus Stack con Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123
```

### Custom Metrics y ServiceMonitor

```yaml
# servicemonitor-example.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp-monitor
  labels:
    app: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-metrics
  labels:
    app: myapp
spec:
  ports:
  - name: metrics
    port: 8080
    targetPort: 8080
  selector:
    app: myapp
```

## 🚀 CI/CD con Kubernetes

### GitOps con ArgoCD

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/mycompany/myapp-manifests
    targetRevision: HEAD
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

### Pipeline con Tekton

```yaml
# tekton-pipeline.yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: build-and-deploy
spec:
  params:
  - name: git-url
    type: string
  - name: image-name
    type: string
  tasks:
  - name: fetch-source
    taskRef:
      name: git-clone
    params:
    - name: url
      value: $(params.git-url)
  - name: build-image
    taskRef:
      name: buildah
    runAfter:
    - fetch-source
    params:
    - name: IMAGE
      value: $(params.image-name)
  - name: deploy-to-cluster
    taskRef:
      name: kubectl-deploy
    runAfter:
    - build-image
    params:
    - name: image
      value: $(params.image-name)
```

## 🛡️ Mejores Prácticas de Seguridad

### Security Checklist

```bash
# 1. Actualizar cluster regularmente
kubectl version
kubeadm upgrade plan

# 2. Escanear imágenes de contenedores
trivy image nginx:1.21

# 3. Verificar configuraciones de seguridad
kubectl get pods -o jsonpath='{.items[*].spec.securityContext}'

# 4. Auditar RBAC
kubectl auth can-i --list --as=system:serviceaccount:default:myapp

# 5. Verificar network policies
kubectl get networkpolicies -A

# 6. Rotar certificates
kubeadm certs check-expiration
```

### Hardening de Cluster

```yaml
# admission-controller-config.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "restricted"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: []
      runtimeClasses: []
      namespaces: [kube-system, kube-public, kube-node-lease]
```

## 🔧 Troubleshooting Avanzado

### Debugging de Pods

```bash
# Ver todos los eventos
kubectl get events --sort-by=.metadata.creationTimestamp

# Debug de pods que no inician
kubectl describe pod problema-pod
kubectl logs problema-pod --previous

# Ejecutar pod de debug
kubectl run debug-pod --image=busybox --rm -it -- /bin/sh

# Verificar DNS
kubectl run dns-test --image=busybox --rm -it -- nslookup kubernetes.default

# Verificar conectividad de red
kubectl run network-test --image=nicolaka/netshoot --rm -it -- /bin/bash
```

### Performance Tuning

```bash
# Ver métricas de recursos
kubectl top nodes
kubectl top pods --all-namespaces

# Verificar límites de recursos
kubectl describe node <node-name> | grep -A 5 "Allocated resources"

# Optimizar etcd
etcdctl --endpoints=<etcd-endpoints> defrag
etcdctl --endpoints=<etcd-endpoints> alarm list
```

## 🎯 Casos de Uso Empresariales

### Microservicios E-commerce

```yaml
# ecommerce-namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce
  labels:
    name: ecommerce
---
# Frontend Service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: nginx:alpine
        ports:
        - containerPort: 80
---
# API Gateway
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: ecommerce
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: traefik:v2.9
        ports:
        - containerPort: 8080
```

### Data Pipeline con Kafka

```yaml
# kafka-cluster.yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-cluster
spec:
  kafka:
    version: 3.4.0
    replicas: 3
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
      - name: tls
        port: 9093
        type: internal
        tls: true
    config:
      offsets.topic.replication.factor: 3
      transaction.state.log.replication.factor: 3
      transaction.state.log.min.isr: 2
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 100Gi
        deleteClaim: false
  zookeeper:
    replicas: 3
    storage:
      type: persistent-claim
      size: 10Gi
      deleteClaim: false
  entityOperator:
    topicOperator: {}
    userOperator: {}
```

## Conclusión

**Kubernetes** representa el futuro de la orquestación de contenedores y es una **herramienta fundamental** para cualquier DevOps Engineer moderno. Esta guía te proporciona:

- **🏗️ Fundamentos sólidos** desde instalación hasta configuración avanzada
- **🛠️ Herramientas prácticas** con ejemplos reales de producción  
- **🔒 Seguridad enterprise** con RBAC, network policies y hardening
- **📊 Observabilidad completa** con Prometheus, Grafana y métricas custom
- **🚀 CI/CD integration** con GitOps y pipelines automatizados
- **🎯 Casos de uso reales** para aplicaciones empresariales

**Beneficios implementados:**
- Escalabilidad automática y gestión de recursos
- Alta disponibilidad con self-healing
- Seguridad avanzada y compliance
- Portabilidad multi-cloud
- DevOps workflows optimizados

**Próximos pasos recomendados:**
- Implementar service mesh con Istio
- Explorar Kubernetes operators
- Configurar disaster recovery
- Optimizar costos con cluster autoscaling
- Integrar con herramientas de ML/AI

Con este conocimiento, estás preparado para gestionar clusters de Kubernetes en cualquier entorno empresarial. ¡La orquestación de contenedores nunca fue tan poderosa! 🚀

**Recursos adicionales:**
- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
- [Kubernetes GitHub](https://github.com/kubernetes/kubernetes)
- [CNCF Landscape](https://landscape.cncf.io/)
- [Kubernetes Academy](https://kubernetes.academy/)
