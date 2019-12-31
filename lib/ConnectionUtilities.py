import openstack
import yaml

class Opts(object):
    def __init__(self, debug=False):
        with open("config/openstack.yaml", 'r') as stream:
            data_loaded = yaml.safe_load(stream) 
        self.auth_url = data_loaded['auth']['auth_url']
        self.username = data_loaded['auth']['username']
        self.password = data_loaded['auth']['password']
        self.project_name = data_loaded['auth']['project_name']
        self.user_domain_name = data_loaded['auth']['user_domain_name']
        self.project_domain_name = data_loaded['auth']['project_domain_name']
        self.region_name = data_loaded['region_name']
        # Use identity v3 API for examples.
        self.identity_api_version = '3'


def create_connection_from_config():
    opts = Opts()
    return openstack.connection.Connection(
        auth_url = opts.auth_url,
        username = opts.username,
        password = opts.password,
        project_name = opts.project_name,
        region_name = opts.region_name,
        project_domain_name = opts.project_domain_name,
        user_domain_name = opts.user_domain_name,
        identity_api_version = opts.identity_api_version
    )