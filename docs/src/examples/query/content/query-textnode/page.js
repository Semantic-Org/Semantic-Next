import { $ } from '@semantic-ui/query';

// Compare .text() vs .textNode()
$('.fulltext').text($('.parent').text());
$('.nodetext').text($('.parent').textNode());
$('.simpletext').text($('.simple').textNode());
