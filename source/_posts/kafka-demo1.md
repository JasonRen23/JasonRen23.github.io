---
title: kafka学习(1)-producer和consumer的简单demo
date: 2018-08-19
categories: 消息队列
tags: Kafka
---

## 版本
> 操作系统：OS X 10.10.3
>
> JDK版本： 1.8
>
> zookeeper版本：zookeeper-3.5.9
>
> kafka版本：1.0.0

## 包依赖

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>0.11.0.1</version>
</dependency>
```
## 启动zookeeper和kafka
zookeeper

```bash
./bin/zkServer.sh start

```
kafka

```bash
sh bin/kafka-server-start.sh  
config/server.properties &
```
<!-- more -->

## 在kafka新建一个主题

![](https://images2015.cnblogs.com/blog/735367/201612/735367-20161226175429711-638862783.png)

新建了一个名为`first_topic`的主题

```bash
sh bin/kafka-topics.sh --create 
--zookeeper localhost:2181 
--replication-factor 1 
--partitions 1 
--topic first_topic
```
查看已经建立的主题


```bash
sh bin/kafka-topics.sh --list 
--zookeeper localhost:2181
```

## 生产者Java代码

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.Scanner;

/**
 * @author JasonRen
 * @since 2018/8/9 上午11:22
 */
public class Producer {
    public static void main(String[] args) {
        //配置属性
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "localhost:9092");
        //指定序列化器
        properties.put("key.serializer", StringSerializer.class.getName());
        properties.put("value.serializer", StringSerializer.class.getName());

        //生产者发送消息
        String topic = "first_topic";
        KafkaProducer<String, String> producer = new KafkaProducer<>(properties);

        for (int i = 0; i < 11; i++) {
            Scanner scanner = new Scanner(System.in);
            String value = scanner.nextLine();

            ProducerRecord<String, String> msg = new ProducerRecord<>(topic, value);
            //发送消息
            producer.send(msg);
        }
        //保证缓存的消息能及时发送
        producer.flush();

    }
}

```
## 消费者Java代码

```java
package cn.jasonren.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Properties;

/**
 * @author JasonRen
 * @since 2018/8/9 上午11:20
 */
public class Consumer {
    /** logger */
    private static final Logger LOGGER = LoggerFactory.getLogger(Consumer.class);

    public static void main(String[] args) {
        //配置属性
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        //consumer组id
        props.put("group.id", "test");
        //自动调整offset到最新的offset
        props.put("auto.offset.reset", "earliest");
        //是否自动确认offset
        props.put("enable.auto.commit", "true");
        //指定反序列化器
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
        //指定订阅主题
        consumer.subscribe(Arrays.asList("first_topic"));
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                LOGGER.info("offset = {}, key = {}, value = {}", record.offset(), record.key(), record.value());
            }
        }
    }
}

```

为了更直观地看效果，我们可以把不需要打印的日志给关掉，直接在`log4j.properties`里关掉


```bash
log4j.logger.kafka.consumer.ZookeeperConsumerConnector=OFF
log4j.logger.org.apache.kafka.clients.FetchSessionHandler=OFF
log4j.logger.org.apache.kafka.clients.consumer.internals.Fetcher=OFF
log4j.logger.org.springframework.kafka.listener.KafkaMessageListenerContainer=OFF
log4j.logger.org.apache.kafka.clients.consumer.internals.AbstractCoordinator=OFF
log4j.logger.org.apache.kafka.clients.consumer.internals.ConsumerCoordinator = OFF
log4j.logger.org.apache.kafka.clients.NetworkClient = OFF
log4j.logger.org.apache.kafka.common.metrics.Metrics= OFF
log4l.logger.org.apache.kafka.clients.Metadata = OFF
```
## 消费者和生产者消息传递
生产者发送十条消息：

<img src="https://ws1.sinaimg.cn/large/73d640f7ly1fuec8pbdw8j20d0090gn2.jpg" alt="Producer console log" width="40%" height="40%" style="display:block;margin:auto"/>

消费者消费消息，offset自增：

![Consumer console log](https://ws1.sinaimg.cn/large/73d640f7ly1fuec6pam9wj21ee09cgq7.jpg)

