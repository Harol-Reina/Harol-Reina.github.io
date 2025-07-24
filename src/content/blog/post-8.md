---
title: 'Infrastructure as Code: Automatización y Gestión Moderna de Infraestructura'
excerpt: Domina Infrastructure as Code con Terraform, Ansible y mejores prácticas de DevOps. Aprende a crear, gestionar y escalar infraestructura de manera declarativa, versionada y reproducible en múltiples proveedores cloud.
publishDate: 'July 25 2025'
tags:
  - Infrastructure-as-Code
  - Terraform
  - Ansible
  - DevOps
  - Automatización
  - AWS
  - Azure
  - GCP
  - CloudFormation
  - GitOps
seo:
  image:
    src: '/post-8.jpg'
    alt: Dashboard de Infrastructure as Code mostrando automatización de infraestructura
---

![Automatización de infraestructura con Infrastructure as Code](/post-8.jpg)

**Infrastructure as Code (IaC)** es una de las prácticas más transformadoras en el ecosistema DevOps moderno. Esta metodología permite **gestionar y aprovisionar infraestructura a través de código** en lugar de procesos manuales, proporcionando consistencia, velocidad y escalabilidad sin precedentes en la gestión de recursos cloud y on-premises.

En esta guía integral, exploraremos desde los conceptos fundamentales hasta implementaciones avanzadas de **Terraform**, **Ansible**, **AWS CloudFormation** y otras herramientas líderes, incluyendo patrones de diseño, mejores prácticas de seguridad y estrategias de CI/CD para infraestructura.

## ¿Por qué Infrastructure as Code es Esencial?

### Ventajas Fundamentales de IaC:

- **🔄 Reproducibilidad**: Infraestructura idéntica en múltiples entornos
- **📚 Versionado**: Control de cambios con Git y rollback automático
- **⚡ Velocidad**: Provisioning automatizado en minutos vs días
- **🛡️ Consistencia**: Eliminación de configuration drift y errores humanos
- **💰 Optimización de Costos**: Gestión inteligente de recursos y auto-scaling
- **🔒 Seguridad**: Políticas de seguridad como código y compliance automatizado

### Problemas que Resuelve IaC:

- **Snowflake Servers**: Servidores únicos imposibles de replicar
- **Configuration Drift**: Diferencias no documentadas entre entornos
- **Manual Provisioning**: Procesos lentos y propensos a errores
- **Falta de Documentación**: Infraestructura no documentada
- **Escalabilidad Limitada**: Dificultad para escalar horizontalmente

## 🏗️ Herramientas Principales de IaC

### Comparación de Herramientas IaC

| Herramienta | Tipo | Enfoque | Cloud Support | Curva Aprendizaje |
|-------------|------|---------|---------------|-------------------|
| **Terraform** | Declarativo | Provisioning | Multi-cloud | Media |
| **Ansible** | Imperativo/Declarativo | Configuration | Multi-cloud | Baja |
| **CloudFormation** | Declarativo | Provisioning | AWS Only | Media-Alta |
| **Pulumi** | Declarativo | Provisioning | Multi-cloud | Alta |
| **CDK** | Imperativo | Provisioning | Multi-cloud | Alta |

### Arquitectura de IaC Stack

```bash
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE AS CODE                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   GitOps    │  │   CI/CD     │  │   Policy as Code    │  │
│  │ (GitHub)    │  │ (Jenkins)   │  │   (Open Policy      │  │
│  │             │  │             │  │    Agent)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Terraform  │  │   Ansible   │  │   Configuration     │  │
│  │(Provisioning│  │(Config Mgmt)│  │   Management        │  │
│  │  & State)   │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│         AWS        │       Azure       │        GCP        │
│    ┌─────────────┐ │  ┌─────────────┐  │ ┌─────────────┐   │
│    │     EC2     │ │  │     VMs     │  │ │ Compute     │   │
│    │     RDS     │ │  │   Cosmos    │  │ │ Engine      │   │
│    │     S3      │ │  │   Storage   │  │ │ Cloud SQL   │   │
│    └─────────────┘ │  └─────────────┘  │ └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🌍 Terraform: Infraestructura Declarativa

### Instalación y Configuración Inicial

```bash
# Instalar Terraform en Linux
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Verificar instalación
terraform version

# Configurar autocompletado
terraform -install-autocomplete

# Configurar credentials AWS
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-west-2"
```

### Estructura de Proyecto Terraform

```bash
terraform-infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── outputs.tf
│   ├── staging/
│   └── prod/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2/
│   ├── rds/
│   └── s3/
├── shared/
│   ├── backend.tf
│   └── providers.tf
└── scripts/
    ├── deploy.sh
    └── destroy.sh
```

### Configuración de Providers y Backend

```hcl
# providers.tf
terraform {
  required_version = ">= 1.5"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "environments/prod/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment   = var.environment
      Project       = var.project_name
      ManagedBy     = "Terraform"
      Owner         = var.owner
      CostCenter    = var.cost_center
      CreatedAt     = timestamp()
    }
  }
}
```

### Módulo VPC Completo

```hcl
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-subnet-${count.index + 1}"
    Type = "Public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-private-subnet-${count.index + 1}"
    Type = "Private"
  }
}

# NAT Gateways
resource "aws_eip" "nat" {
  count = length(var.public_subnet_cidrs)

  domain = "vpc"
  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-eip-${count.index + 1}"
  }
}

resource "aws_nat_gateway" "main" {
  count = length(var.public_subnet_cidrs)

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-gateway-${count.index + 1}"
  }

  depends_on = [aws_internet_gateway.main]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-public-rt"
  }
}

resource "aws_route_table" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-private-rt-${count.index + 1}"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = length(var.public_subnet_cidrs)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = length(var.private_subnet_cidrs)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# Data Sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Security Groups
resource "aws_security_group" "web" {
  name        = "${var.project_name}-${var.environment}-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-web-sg"
  }
}
```

### Variables y Outputs

```hcl
# modules/vpc/variables.tf
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = aws_nat_gateway.main[*].id
}

output "web_security_group_id" {
  description = "ID of the web security group"
  value       = aws_security_group.web.id
}
```

### Implementación de Auto Scaling Group

```hcl
# modules/ec2/main.tf
# Launch Template
resource "aws_launch_template" "web" {
  name_prefix   = "${var.project_name}-${var.environment}-web-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [var.security_group_id]

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    environment = var.environment
    project_name = var.project_name
  }))

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = var.root_volume_size
      volume_type = "gp3"
      encrypted   = true
      delete_on_termination = true
    }
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
    http_put_response_hop_limit = 1
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-${var.environment}-web"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web" {
  name                = "${var.project_name}-${var.environment}-web-asg"
  vpc_zone_identifier = var.subnet_ids
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]

  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}-web-asg"
    propagate_at_launch = true
  }

  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = true
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }
}

# Application Load Balancer
resource "aws_lb" "web" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = var.enable_deletion_protection

  access_logs {
    bucket  = var.access_logs_bucket
    prefix  = "alb-logs"
    enabled = var.enable_access_logs
  }
}

resource "aws_lb_target_group" "web" {
  name     = "${var.project_name}-${var.environment}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.web.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# Auto Scaling Policies
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "${var.project_name}-${var.environment}-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.web.name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "${var.project_name}-${var.environment}-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.web.name
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "70"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.web.name
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "${var.project_name}-${var.environment}-cpu-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "20"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_down.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.web.name
  }
}

# Data Sources
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

### Script de User Data

```bash
#!/bin/bash
# modules/ec2/user-data.sh

# Update system
yum update -y

# Install required packages
yum install -y httpd htop awscli amazon-cloudwatch-agent

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Configure Apache
systemctl start httpd
systemctl enable httpd

# Create a simple health check endpoint
cat <<EOF > /var/www/html/health
OK
EOF

# Create index page
cat <<EOF > /var/www/html/index.html
<!DOCTYPE html>
<html>
<head>
    <title>${project_name} - ${environment}</title>
</head>
<body>
    <h1>Welcome to ${project_name}</h1>
    <p>Environment: ${environment}</p>
    <p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>
    <p>Availability Zone: $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)</p>
</body>
</html>
EOF

# Configure CloudWatch agent
cat <<EOF > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
    "metrics": {
        "namespace": "${project_name}/${environment}",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/httpd/access_log",
                        "log_group_name": "/aws/ec2/${project_name}/${environment}/httpd/access",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/httpd/error_log",
                        "log_group_name": "/aws/ec2/${project_name}/${environment}/httpd/error",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    }
}
EOF

# Start CloudWatch agent
systemctl start amazon-cloudwatch-agent
systemctl enable amazon-cloudwatch-agent
```

## 🔧 Ansible: Configuration Management

### Instalación y Configuración

```bash
# Instalar Ansible en Ubuntu/Debian
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible

# Verificar instalación
ansible --version

# Configurar SSH keys para acceso sin contraseña
ssh-keygen -t rsa -b 4096 -C "ansible@mycompany.com"
ssh-copy-id user@target-server
```

### Estructura de Proyecto Ansible

```bash
ansible-infrastructure/
├── inventories/
│   ├── dev/
│   │   ├── group_vars/
│   │   │   ├── all.yml
│   │   │   └── webservers.yml
│   │   ├── host_vars/
│   │   └── hosts.yml
│   ├── staging/
│   └── prod/
├── roles/
│   ├── common/
│   │   ├── tasks/main.yml
│   │   ├── handlers/main.yml
│   │   ├── vars/main.yml
│   │   ├── defaults/main.yml
│   │   └── templates/
│   ├── webserver/
│   ├── database/
│   └── monitoring/
├── playbooks/
│   ├── site.yml
│   ├── webservers.yml
│   └── database.yml
├── group_vars/
├── host_vars/
├── ansible.cfg
└── requirements.yml
```

### Configuración de Ansible

```ini
# ansible.cfg
[defaults]
inventory = inventories/prod/hosts.yml
remote_user = ansible
host_key_checking = False
retry_files_enabled = False
gathering = smart
fact_caching = memory
stdout_callback = yaml
bin_ansible_callbacks = True

[inventory]
enable_plugins = host_list, script, auto, yaml, ini, toml

[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
pipelining = True
control_path = /tmp/ansible-ssh-%%h-%%p-%%r
```

### Inventario Dinámico

```yaml
# inventories/prod/hosts.yml
all:
  children:
    webservers:
      hosts:
        web01:
          ansible_host: 10.0.1.10
          server_role: primary
        web02:
          ansible_host: 10.0.1.11
          server_role: secondary
        web03:
          ansible_host: 10.0.1.12
          server_role: secondary
      vars:
        nginx_port: 80
        ssl_enabled: true
        
    databases:
      hosts:
        db01:
          ansible_host: 10.0.2.10
          mysql_role: master
        db02:
          ansible_host: 10.0.2.11
          mysql_role: slave
      vars:
        mysql_port: 3306
        mysql_root_password: "{{ vault_mysql_root_password }}"
        
    loadbalancers:
      hosts:
        lb01:
          ansible_host: 10.0.1.5
          lb_role: primary
        lb02:
          ansible_host: 10.0.1.6
          lb_role: backup
      vars:
        haproxy_stats_enabled: true
        
  vars:
    environment: production
    datacenter: us-west-2
    monitoring_enabled: true
```

### Role Completo para Web Server

```yaml
# roles/webserver/tasks/main.yml
---
- name: Update system packages
  package:
    name: '*'
    state: latest
  when: ansible_os_family == "RedHat"

- name: Install required packages
  package:
    name:
      - nginx
      - certbot
      - python3-certbot-nginx
      - htop
      - curl
      - wget
    state: present

- name: Create nginx user
  user:
    name: nginx
    system: yes
    shell: /bin/false
    home: /var/cache/nginx
    createhome: no

- name: Create web directories
  file:
    path: "{{ item }}"
    state: directory
    owner: nginx
    group: nginx
    mode: '0755'
  loop:
    - /var/www/html
    - /var/log/nginx
    - /etc/nginx/conf.d
    - /etc/nginx/ssl

- name: Generate nginx configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
    backup: yes
  notify: restart nginx

- name: Generate virtual host configuration
  template:
    src: vhost.conf.j2
    dest: "/etc/nginx/conf.d/{{ item.name }}.conf"
    owner: root
    group: root
    mode: '0644'
  loop: "{{ nginx_vhosts }}"
  notify: restart nginx

- name: Create index.html
  template:
    src: index.html.j2
    dest: /var/www/html/index.html
    owner: nginx
    group: nginx
    mode: '0644'

- name: Configure firewall
  firewalld:
    port: "{{ item }}"
    permanent: yes
    state: enabled
    immediate: yes
  loop:
    - "80/tcp"
    - "443/tcp"
  when: ansible_os_family == "RedHat"

- name: Generate SSL certificates
  command: >
    certbot --nginx -d {{ item.server_name }}
    --non-interactive --agree-tos --email {{ ssl_email }}
  loop: "{{ nginx_vhosts }}"
  when: ssl_enabled and item.ssl | default(true)

- name: Start and enable nginx
  systemd:
    name: nginx
    state: started
    enabled: yes

- name: Configure log rotation
  template:
    src: nginx-logrotate.j2
    dest: /etc/logrotate.d/nginx
    owner: root
    group: root
    mode: '0644'

- name: Setup nginx monitoring
  template:
    src: nginx-status.conf.j2
    dest: /etc/nginx/conf.d/status.conf
    owner: root
    group: root
    mode: '0644'
  notify: restart nginx
  when: monitoring_enabled
```

### Templates Nginx

```nginx
# roles/webserver/templates/nginx.conf.j2
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# roles/webserver/templates/vhost.conf.j2
server {
    listen 80;
    server_name {{ item.server_name }};
    
    {% if ssl_enabled and item.ssl | default(true) %}
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name {{ item.server_name }};
    
    ssl_certificate /etc/letsencrypt/live/{{ item.server_name }}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{{ item.server_name }}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    {% endif %}

    root {{ item.document_root | default('/var/www/html') }};
    index index.html index.htm index.php;

    # Security
    location ~ /\. {
        deny all;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass {{ item.backend_url }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Default location
    location / {
        try_files $uri $uri/ =404;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Handlers

```yaml
# roles/webserver/handlers/main.yml
---
- name: restart nginx
  systemd:
    name: nginx
    state: restarted

- name: reload nginx
  systemd:
    name: nginx
    state: reloaded

- name: restart firewalld
  systemd:
    name: firewalld
    state: restarted
```

### Variables

```yaml
# roles/webserver/defaults/main.yml
---
nginx_port: 80
ssl_enabled: true
ssl_email: admin@example.com
monitoring_enabled: true

nginx_vhosts:
  - name: default
    server_name: "{{ ansible_fqdn }}"
    document_root: /var/www/html
    ssl: true
    backend_url: "http://127.0.0.1:8080"

nginx_user: nginx
nginx_group: nginx

# Security settings
nginx_remove_default_vhost: true
nginx_server_tokens: "off"

# Performance settings
nginx_worker_processes: "auto"
nginx_worker_connections: 1024
nginx_multi_accept: "on"
```

### Playbook Principal

```yaml
# playbooks/site.yml
---
- name: Configure all infrastructure
  hosts: all
  become: yes
  gather_facts: yes
  
  pre_tasks:
    - name: Update package cache
      package:
        update_cache: yes
      when: ansible_os_family in ['Debian', 'RedHat']

  roles:
    - common

- name: Configure web servers
  hosts: webservers
  become: yes
  
  roles:
    - webserver
    - monitoring

- name: Configure database servers
  hosts: databases
  become: yes
  
  roles:
    - database
    - monitoring

- name: Configure load balancers
  hosts: loadbalancers
  become: yes
  
  roles:
    - loadbalancer
    - monitoring

  post_tasks:
    - name: Verify all services are running
      uri:
        url: "http://{{ ansible_default_ipv4.address }}/health"
        method: GET
        status_code: 200
      delegate_to: localhost
      when: inventory_hostname in groups['webservers']
```

## 🔐 Gestión de Secrets con Ansible Vault

```bash
# Crear archivo de secrets
ansible-vault create group_vars/all/vault.yml

# Editar archivo encriptado
ansible-vault edit group_vars/all/vault.yml

# Encriptar archivo existente
ansible-vault encrypt group_vars/all/secrets.yml

# Desencriptar archivo
ansible-vault decrypt group_vars/all/secrets.yml

# Ver contenido encriptado
ansible-vault view group_vars/all/vault.yml

# Ejecutar playbook con vault
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

```yaml
# group_vars/all/vault.yml (encriptado)
---
vault_mysql_root_password: "super_secure_password_123"
vault_database_user_password: "another_secure_password_456"
vault_ssl_certificate_key: |
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
  -----END PRIVATE KEY-----
vault_api_tokens:
  monitoring: "token_abc123"
  backup: "token_def456"
```

## 🚀 CI/CD para Infrastructure as Code

### GitHub Actions para Terraform

```yaml
# .github/workflows/terraform.yml
name: 'Terraform Infrastructure'

on:
  push:
    branches: [ main, develop ]
    paths: [ 'terraform/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'terraform/**' ]

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    environment: production

    defaults:
      run:
        shell: bash
        working-directory: ./terraform

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: 1.5.0
        terraform_wrapper: false

    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2

    - name: Terraform Format
      id: fmt
      run: terraform fmt -check -recursive
      continue-on-error: true

    - name: Terraform Init
      id: init
      run: terraform init

    - name: Terraform Validate
      id: validate
      run: terraform validate -no-color

    - name: Terraform Plan
      id: plan
      if: github.event_name == 'pull_request'
      run: terraform plan -no-color -input=false
      continue-on-error: true

    - name: Update Pull Request
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request'
      env:
        PLAN: "terraform\n${{ steps.plan.outputs.stdout }}"
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const output = `#### Terraform Format and Style 🖌\`${{ steps.fmt.outcome }}\`
          #### Terraform Initialization ⚙️\`${{ steps.init.outcome }}\`
          #### Terraform Validation 🤖\`${{ steps.validate.outcome }}\`
          #### Terraform Plan 📖\`${{ steps.plan.outcome }}\`

          <details><summary>Show Plan</summary>

          \`\`\`\n
          ${process.env.PLAN}
          \`\`\`

          </details>

          *Pushed by: @${{ github.actor }}, Action: \`${{ github.event_name }}\`*`;

          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
          })

    - name: Terraform Plan Status
      if: steps.plan.outcome == 'failure'
      run: exit 1

    - name: Terraform Apply
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: terraform apply -auto-approve -input=false

  security-scan:
    name: 'Security Scan'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'config'
        scan-ref: './terraform'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  cost-estimation:
    name: 'Cost Estimation'
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
    - name: Setup Infracost
      uses: infracost/actions/setup@v2
      with:
        api-key: ${{ secrets.INFRACOST_API_KEY }}

    - name: Checkout base branch
      uses: actions/checkout@v3
      with:
        ref: '${{ github.event.pull_request.base.ref }}'

    - name: Generate Infracost cost estimate baseline
      run: |
        infracost breakdown --path=./terraform \
                            --format=json \
                            --out-file=/tmp/infracost-base.json

    - name: Checkout PR branch
      uses: actions/checkout@v3

    - name: Generate Infracost diff
      run: |
        infracost diff --path=./terraform \
                       --format=json \
                       --compare-to=/tmp/infracost-base.json \
                       --out-file=/tmp/infracost.json

    - name: Post Infracost comment
      run: |
        infracost comment github --path=/tmp/infracost.json \
                                 --repo=$GITHUB_REPOSITORY \
                                 --github-token=${{github.token}} \
                                 --pull-request=${{github.event.pull_request.number}} \
                                 --behavior=update
```

### Jenkins Pipeline para Ansible

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        ANSIBLE_HOST_KEY_CHECKING = 'False'
        ANSIBLE_VAULT_PASSWORD_FILE = credentials('ansible-vault-password')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Lint') {
            steps {
                sh '''
                    ansible-lint playbooks/
                    yamllint -d relaxed .
                '''
            }
        }
        
        stage('Syntax Check') {
            steps {
                sh '''
                    ansible-playbook playbooks/site.yml \
                        --syntax-check \
                        --inventory inventories/staging/hosts.yml
                '''
            }
        }
        
        stage('Dry Run') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                    ansible-playbook playbooks/site.yml \
                        --check \
                        --diff \
                        --inventory inventories/staging/hosts.yml \
                        --vault-password-file $ANSIBLE_VAULT_PASSWORD_FILE
                '''
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                    ansible-playbook playbooks/site.yml \
                        --inventory inventories/staging/hosts.yml \
                        --vault-password-file $ANSIBLE_VAULT_PASSWORD_FILE \
                        --tags "deploy"
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh '''
                    ansible-playbook playbooks/site.yml \
                        --inventory inventories/prod/hosts.yml \
                        --vault-password-file $ANSIBLE_VAULT_PASSWORD_FILE \
                        --limit "!maintenance" \
                        --tags "deploy"
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    ansible-playbook playbooks/verify.yml \
                        --inventory inventories/${BRANCH_NAME == 'main' ? 'prod' : 'staging'}/hosts.yml
                '''
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'ansible-report.html',
                reportName: 'Ansible Report'
            ])
        }
        
        failure {
            slackSend channel: '#devops',
                     color: 'danger',
                     message: "❌ Infrastructure deployment failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
        
        success {
            slackSend channel: '#devops',
                     color: 'good',
                     message: "✅ Infrastructure deployment successful: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
    }
}
```

## 📊 Monitoreo y Observabilidad

### Terraform para Stack de Monitoreo

```hcl
# monitoring.tf
resource "aws_instance" "prometheus" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.medium"
  subnet_id     = var.private_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.monitoring.id]
  
  user_data = base64encode(templatefile("${path.module}/prometheus-setup.sh", {
    grafana_password = var.grafana_admin_password
  }))

  tags = {
    Name = "prometheus-server"
    Role = "monitoring"
  }
}

resource "aws_security_group" "monitoring" {
  name        = "monitoring-sg"
  description = "Security group for monitoring stack"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", "InstanceId", aws_instance.prometheus.id],
            [".", "NetworkIn", ".", "."],
            [".", "NetworkOut", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "EC2 Instance Metrics"
          period  = 300
        }
      }
    ]
  })
}
```

## 🛡️ Mejores Prácticas de Seguridad

### Terraform Security Scanning

```bash
# Instalar tfsec
curl -s https://raw.githubusercontent.com/aquasecurity/tfsec/master/scripts/install_linux.sh | bash

# Escanear código Terraform
tfsec .

# Configurar reglas custom
cat > .tfsec/config.yml << EOF
severity_overrides:
  AWS018: ERROR
  AWS002: WARNING

exclude:
  - AWS001  # S3 bucket without server-side encryption

minimum_severity: MEDIUM
EOF

# Integrar con pre-commit
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
  
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.81.0
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      - id: terraform_tflint
      - id: terraform_tfsec
EOF
```

### Policy as Code con OPA

```rego
# policies/terraform.rego
package terraform.security

deny[msg] {
    resource := input.planned_values.root_module.resources[_]
    resource.type == "aws_s3_bucket"
    not resource.values.server_side_encryption_configuration
    msg := sprintf("S3 bucket '%s' does not have encryption enabled", [resource.address])
}

deny[msg] {
    resource := input.planned_values.root_module.resources[_]
    resource.type == "aws_security_group"
    rule := resource.values.ingress[_]
    rule.from_port == 22
    "0.0.0.0/0" in rule.cidr_blocks
    msg := sprintf("Security group '%s' allows SSH access from anywhere", [resource.address])
}

deny[msg] {
    resource := input.planned_values.root_module.resources[_]
    resource.type == "aws_instance"
    not resource.values.monitoring
    msg := sprintf("EC2 instance '%s' does not have monitoring enabled", [resource.address])
}
```

## Conclusión

**Infrastructure as Code** representa una **evolución fundamental** en la gestión de infraestructura moderna. Esta guía completa te proporciona:

- **🏗️ Fundamentos sólidos** con Terraform y Ansible
- **🔧 Implementaciones prácticas** para entornos empresariales
- **🚀 CI/CD integration** con pipelines automatizados
- **🛡️ Seguridad enterprise** con scanning y policies
- **📊 Observabilidad completa** con monitoreo integrado
- **🎯 Casos de uso reales** y arquitecturas escalables

**Beneficios implementados:**
- Infraestructura versionada y reproducible
- Despliegues automatizados y consistentes
- Rollback rápido ante problemas
- Compliance y auditoría automatizada
- Optimización continua de costos

**Tecnologías dominaras:**
- **Terraform**: Provisioning declarativo multi-cloud
- **Ansible**: Configuration management y automatización
- **GitOps**: Workflows basados en Git
- **Policy as Code**: Seguridad y compliance automatizada
- **Monitoring as Code**: Observabilidad integrada

**Próximos pasos recomendados:**
- Implementar Terraform Cloud/Enterprise
- Explorar Kubernetes operators
- Integrar con service mesh
- Automatizar disaster recovery
- Optimizar arquitecturas serverless

Con estas herramientas y prácticas, estás preparado para gestionar infraestructura de cualquier escala con la **confianza y eficiencia** que demanda el entorno empresarial moderno. ¡La automatización de infraestructura nunca fue tan poderosa! 🚀

**Recursos adicionales:**
- [Terraform Registry](https://registry.terraform.io/)
- [Ansible Galaxy](https://galaxy.ansible.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [HashiCorp Learn](https://learn.hashicorp.com/)
