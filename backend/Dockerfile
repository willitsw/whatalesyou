# Pull base image
FROM python:3.11.1-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_VERSION 1.3.2

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"

# Set work directory
WORKDIR /code

# Copy requirements
COPY backend/poetry.lock backend/pyproject.toml ./

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# Copy project
COPY /backend .