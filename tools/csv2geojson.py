from sys import argv
from os.path import exists
from sys import exit
import geojson

features = []
with open('SMP.csv', 'r') as infile:
    lines = infile.readlines()
try:
    names = lines[0].split(',')
    index_location = names.index('Location')
    index_latitude = names.index('Latitude') -2
    index_data = names.index('January') - 2
except ValueError:
    print('invalid input file.')
    exit()

for line in lines[1:]:
    items = line.split(',')
    nums = [ float(i) for i in items[2:]]
    features.append(geojson.Feature(properties={"location": items[index_location], "temperatures":nums[index_data:]}, geometry=geojson.Point(nums[index_latitude:index_latitude+2])))

fc = geojson.FeatureCollection(features)
# data = np.genfromtxt(from_file, delimiter=',')
# xyz = data[1:, index_x:index_x+3]
# euler = data[1:, index_psi:index_psi+3]
# time = data[1:, index_time:index_time+1]

# with open(PATH_TEMPLATE, 'r') as f:
#     src = Template(f.read())

# xyz_arrstr = np.char.mod('%.3f', np.hstack((time, xyz)))

# out = src.render(xyzs=",".join(xyz_arrstr.flatten()))

with open('out.geojson', "w") as f:
    f.write(geojson.dumps(fc))
