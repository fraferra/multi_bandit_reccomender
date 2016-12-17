## compute_input.py

import sys, json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    import requests
    #get our data as an array from read_in()
    data = read_in()
    access_token = YEwYX8ySGMDhQpkJx0W6eGRJazeIm6zqeaz9qijg9HAcd-TyNTpvKwK-78sksDaDkk_ofMDm4sYy96jjYxAynuVU3kxSbm6cd24i48Knn5EgobR1hLx0cgAZE4dUWHYx#data[0]

    type_food = 'pizza'#data[1]
    location = 'siena' #data[2]
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': 'bearer %s' % access_token}
    params = {'location': location
          'term': type_food,
          'sort_by': 'rating'
         }

    resp = requests.get(url=url, params=params, headers=headers)


    #return the sum to the output stream
    print ", ".join([x["name"] for x in resp.json()['businesses']])

#start process
if __name__ == '__main__':
    main()