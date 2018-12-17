FROM amazonlinux:2

# Install Python 3.6.
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs

# Copy our package.json so we can do our npm install.
COPY package.json /usr/lib/app/package.json

# Install our python dependencies.
WORKDIR /usr/lib/app
RUN npm install .

# Copy the rest of the source code into the container.
COPY . /usr/lib/app

# Start the service by running service.py.
CMD npm start
