local:
	go build -o bin/verse ./src

dist:
	docker build -t jyking99/vfront:built .

release:
	make dist
	docker tag jyking99/vfront:built jyking99/vfront:release

