# -*- mode: ruby -*-
# vi: set ft=ruby :

PROJECT_NAME = "mfcs"
API_VERSION = "2"

Vagrant.configure(API_VERSION) do |config|
	config.vm.define PROJECT_NAME, primary: true do |config|
		config.vm.provider :virtualbox do |vb|
			vb.name = PROJECT_NAME
		end

		config.vm.box = "centos6.4"
		config.vm.box_url = "http://vagrant.lib.wvu.edu/centos6.4.box"

		config.vm.network :forwarded_port, guest: 80, host: 8080
		config.vm.network :forwarded_port, guest: 10000, host: 10000

		config.vm.provision "shell", path: "bootstrap.sh"
	end
end
