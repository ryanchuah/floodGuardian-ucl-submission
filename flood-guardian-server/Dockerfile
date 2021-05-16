
FROM python:3-onbuild
COPY . /usr/src/app
ENV PYTHONPATH "${PYTHONPATH}:/usr/src/app"
CMD ["python", "-u", "server.py"]