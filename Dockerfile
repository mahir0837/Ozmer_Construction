# Use small nginx image
FROM nginx:alpine

# Copy static site into nginx's default html directory
COPY . /usr/share/nginx/html

# Optional cleanup for MacOS junk files
RUN find /usr/share/nginx/html -name ".DS_Store" -delete

EXPOSE 80
