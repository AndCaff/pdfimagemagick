from  node
RUN apt update
RUN apt install -y imagemagick  ghostscript
RUN mkdir /tmp/ramdisk   
RUN chmod 777 /tmp/ramdisk
RUN sed -i 's\<policy domain="coder" rights="none" pattern="PDF" />\<policy domain="module" rights="read|write" pattern="PDF">\' /etc/ImageMagick-6/policy.xml
COPY /app /app

WORKDIR /app
RUN npm i
CMD ["node", "index.js"]
EXPOSE 3000