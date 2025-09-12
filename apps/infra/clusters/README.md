flux uninstall --namespace=flux-system
kubectl delete gitrepositories.source.toolkit.fluxcd.io --all -n flux-system
kubectl delete kustomizations.kustomize.toolkit.fluxcd.io --all -n flux-system
flux github \
  --token-auth \
  --owner=mateovelilla \
  --repository=grant-line \
  --branch=main \
  --path=apps/infra/clusters \
  --personal  \
  -n grant-line-flux-system