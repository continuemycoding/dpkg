FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY debs ./debs

COPY Release Packages* ./

EXPOSE 80 443
