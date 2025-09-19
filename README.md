## THE GRANT LINE
>  **files/diagram.excalidraw**
<img src="./images/diagram.png">

### ROADMAP
- Infrastructure:
    * [ ] Generate CI/CD
- Frontend:
    * [ ] Figma Design
- Backend:
    * [ ] Apply Metrics
    
---
```bash
$ docker build . --target api --tag api:latest
$ docker run -d -p 4000:4000 --name api api
```