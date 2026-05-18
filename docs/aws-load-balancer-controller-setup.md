# AWS Load Balancer Controller — Installation Guide

> Run all commands from the machine where `aws` and `kubectl` are configured (local Mac if you created the cluster with `eksctl` locally). Requires `aws`, `eksctl`, `kubectl`, and `helm` installed.

## Variables

```bash
CLUSTER_NAME=eventcart-eks-01
REGION=us-east-2
ACCOUNT_ID=735235878184
```

---

## Step 1 — Download the IAM Policy

> **Important:** The policy version must match the controller version installed by Helm. The `eks/aws-load-balancer-controller` chart currently installs v3.3.0 — use the v3.3.0 policy below.

```bash
ALBURL=https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v3.3.0/docs/install/iam_policy.json
curl -Lo iam_policy.json "$ALBURL"
```

Verify the download:

```bash
head -3 iam_policy.json
# Expected: {"Version":"2012-10-17","Statement":[...
```

---

## Step 2 — Create the IAM Policy

```bash
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

---

## Step 3 — Create the IAM Role for Service Account (IRSA)

```bash
eksctl create iamserviceaccount --cluster=eventcart-eks-01 --namespace=kube-system --name=aws-load-balancer-controller --role-name AmazonEKSLoadBalancerControllerRole --attach-policy-arn=arn:aws:iam::735235878184:policy/AWSLoadBalancerControllerIAMPolicy --approve --region=us-east-2
```

---

## Step 4 — Install the Controller via Helm

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```

```bash
VPC_ID=$(aws eks describe-cluster --name eventcart-eks-01 --region us-east-2 --query "cluster.resourcesVpcConfig.vpcId" --output text)
```

```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=eventcart-eks-01 --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller --set region=us-east-2 --set vpcId=$VPC_ID
```

---

## Step 5 — Verify Installation

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
```

Expected output:

```
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           1m
```

---

## Step 6 — Verify Ingress Gets an Address

Watch for the ADDRESS to populate (takes ~30–60 seconds):

```bash
kubectl get ingress -n dev -w
```

The `ADDRESS` column should show the ALB DNS name (e.g. `k8s-dev-xxxx.us-east-2.elb.amazonaws.com`).

---

## Troubleshooting

### Policy version mismatch (AccessDenied on DescribeListenerAttributes)

If the controller logs show `AccessDenied` for `DescribeListenerAttributes`, the IAM policy is outdated (e.g. v2.7.2 policy installed but controller is v3.3.0). Fix by updating the policy to the correct version:

```bash
ALBURL=https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v3.3.0/docs/install/iam_policy.json
curl -Lo iam_policy_v3.json "$ALBURL"
```

```bash
aws iam create-policy-version --policy-arn arn:aws:iam::735235878184:policy/AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy_v3.json --set-as-default
```

The controller picks up the new permissions automatically within ~30 seconds.

### OIDC provider not associated

If Step 3 fails, associate the OIDC provider first:

```bash
eksctl utils associate-iam-oidc-provider --cluster=eventcart-eks-01 --region=us-east-2 --approve
```

Then re-run Step 3.

### Subnet tagging

Public subnets must have the tag `kubernetes.io/role/elb=1` for internet-facing ALBs. Add it via the AWS console or:

```bash
aws ec2 create-tags --resources <subnet-id> --tags Key=kubernetes.io/role/elb,Value=1 --region us-east-2
```
