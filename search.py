## compute_input.py

import sys, json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #sys.stdout.flush()

    import requests
    #get our data as an array from read_in()
    lines = read_in()


    app_id = 'myzQ1TP-TCzRmWi3gx32Dw'
    app_secret = 'fhKhqWG3cjQeGmMgXZ7oUkt6MaqphwZp2Br4v9u6jlfyaYzmjd2mng6PkTRCNY4P'
    data = {'grant_type': 'client_credentials',
            'client_id': app_id,
            'client_secret': app_secret}
    access_token = requests.post('https://api.yelp.com/oauth2/token', data=data).json()['access_token']



    type_food = lines[0]
    location = lines[1]
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': 'bearer %s' % access_token}
    params = {'location': location,
          'term': type_food,
          'sort_by': 'rating'
         }

    resp = requests.get(url=url, params=params, headers=headers)

    #return the sum to the output stream
    #sys.stdout.write( ", ".join([x["name"] for x in resp.json()['businesses']]))
    print  ", ".join([x["name"] for x in resp.json()['businesses']])
    sys.stdout.flush()


#start process
if __name__ == '__main__':
    main()