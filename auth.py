## compute_input.py

import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    import requests

    app_id = 'myzQ1TP-TCzRmWi3gx32Dw'
    app_secret = 'fhKhqWG3cjQeGmMgXZ7oUkt6MaqphwZp2Br4v9u6jlfyaYzmjd2mng6PkTRCNY4P'
    data = {'grant_type': 'client_credentials',
            'client_id': app_id,
            'client_secret': app_secret}
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    #get our data as an array from read_in()
    lines = read_in()


    #return the sum to the output stream
    print token

#start process
if __name__ == '__main__':
    main()