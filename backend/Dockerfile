# Pull base image
FROM python:3.11.1-bullseye

ARG ENVIRONMENT
ARG DJANGO_DEBUG
ARG DJANGO_SECRET_KEY
ARG PG_NAME
ARG PG_USER
ARG PG_PASSWORD
ARG PG_HOST
ARG PG_PORT
ARG PORT

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_VERSION 1.3.2
ENV ENVIRONMENT ${ENVIRONMENT}
ENV DJANGO_DEBUG ${DJANGO_DEBUG}
ENV DJANGO_SECRET_KEY ${DJANGO_SECRET_KEY}
ENV PG_NAME ${PG_NAME}
ENV PG_USER ${PG_USER}
ENV PG_PASSWORD ${PG_PASSWORD}
ENV PG_HOST ${PG_HOST}
ENV PG_PORT ${PG_PORT}
ENV PORT ${PORT}

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"

# Set work directory
WORKDIR /code

# Copy requirements
COPY poetry.lock pyproject.toml ./

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

# Copy project
COPY . .

# collect static files
RUN python manage.py collectstatic --noinput

CMD gunicorn whatalesyou.wsgi:application --bind 0.0.0.0:$PORT